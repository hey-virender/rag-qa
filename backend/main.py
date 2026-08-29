from fastapi import FastAPI,UploadFile,File,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tempfile import TemporaryFile
from extract import extract_text
from embeddings import store_chunks,embed_chunks
import os
from chunking import chunk_text



app = FastAPI()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR,exist_ok=True)


@app.post("/upload")
async def upload_pdf(file:UploadFile = File(...)):
  contents = await file.read()
  if file.filename is None:
    raise HTTPException(status_code=400,detail="No file name provided")
  path = os.path.join(UPLOAD_DIR, file.filename)
  with open(path,"wb") as f:
    f.write(contents)
  extracted = extract_text(path)
  chunks = chunk_text(extracted)
  embeddings = embed_chunks(chunks)
  store_chunks(chunks=chunks,embeddings=embeddings,doc_id=file.filename)
  return {"message": "Upload successful", "chunks_created": len(chunks)}
  
