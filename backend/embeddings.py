from fastembed import TextEmbedding
from pinecone import Pinecone,ServerlessSpec
from config import settings

model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

pc = Pinecone(api_key=settings.pinecone_api_key.get_secret_value())

INDEX_NAME = "rag-qa"

if INDEX_NAME not in [idx.name for idx in pc.list_indexes()]:
  pc.create_index(
    name=INDEX_NAME,
    dimension=384,
    metric="cosine",
    spec = ServerlessSpec(cloud="aws", region="us-east-1")
  )

index = pc.Index(INDEX_NAME)


def embed_chunks(chunks:list[str])-> list[list[float]]:
  return [vec.tolist() for vec in model.embed(chunks)]

def store_chunks(chunks:list[str],embeddings:list[list[float]],doc_id:str):
  vectors = []
  for i, (chunk, embedding) in enumerate(zip(chunks,embeddings)):
      chunk_id = f"{doc_id}_chunk_{i}"
      metadata = {"text":chunk}
      vectors.append((chunk_id, embedding,metadata))
  index.upsert(vectors=vectors)


def retrieve_chunks(question:str,n_results:int = 3)->list[str]:
  question_embedding = [vec.tolist() for vec in model.embed([question])][0]
  results = index.query(vector=question_embedding,
                        top_k=n_results,
                        include_metadata=True)
  chunks = []
  for match in results.matches:
    if match.metadata is not None:
      chunks.append(match.metadata["text"])
  return chunks