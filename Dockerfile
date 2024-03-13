# Node.jsのAlpine版をベースイメージとして使用します。
FROM node:18-alpine

# アプリケーションのソースコードを含むディレクトリを作成します。
WORKDIR /app/nextjs-book-ec

# Alpineのパッケージリストを更新し、OpenSSLをインストールします。
# --no-cacheオプションを使用することで、キャッシュを残さずにインストールを行い、イメージサイズを小さく保ちます。
RUN apk update && apk add --no-cache openssl

# Node.jsの依存関係をコピーし、インストールします。
# package.jsonとpackage-lock.jsonをコピーします。
COPY package*.json ./
# RUN npm install

# アプリケーションの残りのソースコードをコピーします。
COPY . .

# アプリケーションがリッスンするポートをDockerに通知します。
EXPOSE 3000
EXPOSE 5555

# アプリケーションを起動するコマンドを定義します。
# CMD ["npm", "start"]
