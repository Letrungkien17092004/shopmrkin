import openai # type: ignore


import os


openai.api_key = os.getenv("CO_CON_CAC_TIEN_MUA") 

def chat_with_openai():
    messages = [
        {"role": "system", "content": "Bạn là một trợ lý AI hữu ích."}
    ]

    print("💬 Bắt đầu trò chuyện với AI (gõ 'exit' để thoát)")
    
    while True:
        user_input = input("👤 Bạn: ")
        if user_input.lower() in ["exit", "quit"]:
            print("👋 Kết thúc trò chuyện.")
            break

        messages.append({"role": "user", "content": user_input})

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",  # hoặc "gpt-3.5-turbo"
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )

            ai_reply = response['choices'][0]['message']['content']
            print(f"🤖 AI: {ai_reply.strip()}")
            messages.append({"role": "assistant", "content": ai_reply})

        except Exception as e:
            print(f"❌ Lỗi khi gọi API: {e}")

if __name__ == "__main__":
    chat_with_openai()
