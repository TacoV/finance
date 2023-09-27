git pull

if [ ! -f .env.local ]; then
    cp -n .env.local.example .env.local
    echo 'Nieuwe .env.local klaargezet. Vul de gegevens aan en start dit script opnieuw!'
    exit
fi

npm install
npm run format
npm run dev
