# Nutria — cópia local independente

Esta é uma cópia local e independente da landing page Nutria. Ela mantém os assets fornecidos, o fluxo de download de demonstração e agora oferece tema claro/escuro. Nenhum serviço gerenciado ou publicação está configurado nesta pasta.

## Rodar no Windows

1. Instale as dependências a partir do lockfile: `npm.cmd ci`.
2. Inicie o servidor local: `npm.cmd run dev`.
3. Abra no navegador o endereço informado pelo Vite (por padrão, `http://localhost:5173`).

Para validar a build e o código, use `npm.cmd run build` e `npm.cmd run lint`.

## Tema

No primeiro acesso, a página respeita a preferência de aparência do sistema. O botão de lua/sol no cabeçalho alterna os temas; a escolha fica salva no navegador em `localStorage`.

## Download Android de demonstração

O arquivo em `public/downloads/nutria-placeholder.txt` é apenas um placeholder de texto e não pode ser instalado como APK. Antes de distribuir o aplicativo, substitua-o pelo APK assinado do Nutria.
