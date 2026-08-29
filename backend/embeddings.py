from sentence_transformers import SentenceTransformer
import chromadb

model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("documents")

def embed_chunks(chunks:list[str])-> list[list[float]]:
  return model.encode(chunks).tolist()

def store_chunks(chunks:list[str],embeddings:list[list[float]],doc_id:str):
  ids = [f"{doc_id}_chunk_{i}" for i in range (len(chunks))]
  collection.add(ids=ids,
                 embeddings=embeddings, #type: ignore[arg-type]
                 documents=chunks)


def retrieve_chunks(question:str,n_results:int = 3)->list[str]:
  question_embeddings = model.encode([question]).tolist()[0]
  results = collection.query(query_embeddings=[question_embeddings],
    n_results=n_results)
  documents = results.get("documents")
  if documents is None:
    return []
  return documents[0]