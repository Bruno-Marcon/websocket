import asyncio
import websockets

clients = set()

async def send_message(message, status_code):
    if clients:
        if status_code == 200:
            await asyncio.gather(*[client.send(f"200 - {message}") for client in clients])
        elif status_code in [401, 403, 404, 500]:
            await asyncio.gather(*[client.send(f"{status_code} - {message}") for client in clients])
        else:
            await asyncio.gather(*[client.send(f"500 - Erro interno do servidor: Código de status inválido") for client in clients])

async def handle_client(websocket, path):
    clients.add(websocket)
    try:
        async for message in websocket:
            print(f"Mensagem recebida do cliente: {message}")
            
            if algum_critério(message):
                await send_message(f"Recebi sua mensagem: {message}", 200)
            else:
                await send_message(f"Sua mensagem foi recusada: {message}", 403)
    finally:
        clients.remove(websocket)

def algum_critério(message):
    return len(message) > 5

async def main():
    async with websockets.serve(handle_client, "localhost", 8765):
        print("Servidor de eventos WebSocket iniciado.")
        await asyncio.Future()

asyncio.run(main())
