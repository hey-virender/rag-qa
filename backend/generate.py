from config import settings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from typing import cast


llm = ChatGroq(model=settings.groq_model,api_key=settings.groq_api_key,temperature=0)

answer_prompt = ChatPromptTemplate.from_messages([
  ("system","Answer the question using ONLY the context provided below."
   "If the context doesn't contain the enough information to answer, say so clearly-"
   "do not use outside knowledge or make up information. \n\n"
   "Context:\n{context}"),
   ("human","{question}")

])

answer_chain = answer_prompt | llm
def generate_answer(question:str, chunks: list[str])->str:
  context = "\n\n".join(chunks)
  result = answer_chain.invoke({"context":context,"question":question})
  return cast(str,result.content)