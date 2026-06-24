# URL pública temporal para demo con Jean
# Ejecutar en una terminal (con npm run dev activo en otra):

npx localtunnel --port 3000

# Te dará una URL como: https://xxxx.loca.lt
# Envíasela a Jean — la abre en su navegador desde su computadora.

# MongoDB (datos reales en búsqueda):
# 1. Copia .env.example → .env.local
# 2. Pon tu contraseña real en MONGODB_URI
# 3. Reinicia npm run dev
# 4. POST http://localhost:3000/api/screening/seed (carga datos demo)

# Atlas: Network Access → permitir 0.0.0.0/0 (o IP del servidor)
