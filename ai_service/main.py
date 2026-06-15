import os
import cv2
import numpy as np
import requests
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from insightface.app import FaceAnalysis

app = FastAPI(title="AuraPrism Face Recognition AI Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize InsightFace Analysis App
# Using buffalo_l, which is the standard balanced model pack (includes det & rec models)
# ctx_id=-1 forces execution on CPU (perfect for Render free tier or general systems without NVIDIA CUDA)
print("Initializing InsightFace analysis engine ( buffalo_l )...")
try:
    face_analyzer = FaceAnalysis(name='buffalo_l', allowed_modules=['detection', 'recognition'])
    face_analyzer.prepare(ctx_id=-1, det_size=(640, 640))
    print("InsightFace initialized successfully!")
except Exception as e:
    print(f"Error initializing InsightFace: {e}")
    face_analyzer = None

class MatchRequest(BaseModel):
    guestEmbedding: List[float]
    candidateEmbeddings: List[List[float]]
    threshold: float = 0.85

def download_image(url: str) -> np.ndarray:
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        nparr = np.frombuffer(response.content, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Failed to decode image from URL")
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download image: {str(e)}")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "engine": "InsightFace Model buffalo_l",
        "device": "CPU"
    }

@app.post("/extract-face")
async def extract_face(file: UploadFile = File(...)):
    """
    Extracts the face embedding for a guest's selfie.
    Finds the largest/dominant face in the image and returns its 512-d embedding.
    """
    if face_analyzer is None:
        raise HTTPException(status_code=503, detail="AI Engine is offline or failed to initialize.")

    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")

        # Detect faces
        faces = face_analyzer.get(img)
        if not faces:
            raise HTTPException(status_code=400, detail="No faces detected in the selfie. Please try again with a clearer picture.")

        # If multiple faces detected, pick the one with the largest bounding box (dominant face)
        dominant_face = max(faces, key=lambda x: (x.bbox[2] - x.bbox[0]) * (x.bbox[3] - x.bbox[1]))
        
        # Calculate normed embedding
        embedding = dominant_face.embedding
        norm = np.linalg.norm(embedding)
        normed_emb = (embedding / (norm if norm > 0 else 1e-5)).tolist()
        
        bbox = [float(val) for val in dominant_face.bbox]

        return {
            "success": True,
            "faceLocation": {
                "x1": bbox[0],
                "y1": bbox[1],
                "x2": bbox[2],
                "y2": bbox[3]
            },
            "faceEmbedding": normed_emb
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal face extraction error: {str(e)}")

@app.post("/process-photo")
async def process_photo(photoUrl: str = Form(...)):
    """
    Downloads a photo from a URL, detects ALL faces in it, 
    and returns their bounding box coordinates and 512-d embeddings.
    """
    if face_analyzer is None:
        raise HTTPException(status_code=503, detail="AI Engine is offline or failed to initialize.")

    try:
        img = download_image(photoUrl)
        
        # Detect faces in photo
        faces = face_analyzer.get(img)
        
        results = []
        for face in faces:
            # Normalize embedding
            embedding = face.embedding
            norm = np.linalg.norm(embedding)
            normed_emb = (embedding / (norm if norm > 0 else 1e-5)).tolist()
            
            bbox = [float(val) for val in face.bbox]
            
            results.append({
                "faceLocation": {
                    "x1": bbox[0],
                    "y1": bbox[1],
                    "x2": bbox[2],
                    "y2": bbox[3]
                },
                "faceEmbedding": normed_emb
            })
            
        return {
            "success": True,
            "facesCount": len(results),
            "detectedFaces": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal photo processing error: {str(e)}")

@app.post("/match-face")
async def match_face(req: MatchRequest):
    """
    Calculates cosine similarities between a guest's selfie embedding 
    and a list of candidate photo embeddings. Returns the indices of matching candidates.
    """
    try:
        guest_emb = np.array(req.guestEmbedding, dtype=np.float32)
        # Ensure it is normalized
        guest_norm = np.linalg.norm(guest_emb)
        if guest_norm > 0:
            guest_emb = guest_emb / guest_norm

        matches = []
        
        for idx, cand in enumerate(req.candidateEmbeddings):
            cand_emb = np.array(cand, dtype=np.float32)
            cand_norm = np.linalg.norm(cand_emb)
            if cand_norm > 0:
                cand_emb = cand_emb / cand_norm
            
            # Since vectors are normalized, cosine similarity is just the dot product
            similarity = float(np.dot(guest_emb, cand_emb))
            
            if similarity >= req.threshold:
                matches.append({
                    "index": idx,
                    "similarity": similarity
                })
                
        # Sort matches by similarity score descending
        matches.sort(key=lambda x: x["similarity"], reverse=True)

        return {
            "success": True,
            "matches": matches,
            "matchesCount": len(matches)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal face matching error: {str(e)}")
