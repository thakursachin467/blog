# /bin/sh
echo "Starting the Development Server"
npm install
cd database/prisma
docker-compose up
prisma deploy -e ../Config/dev.env
cd ../../
npm run start-dev
echo "Development Server Started"