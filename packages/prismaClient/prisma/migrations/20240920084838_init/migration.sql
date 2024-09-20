-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dateandTime" TIMESTAMP(3) NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "Meet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetsParticipants" (
    "meetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MeetsParticipants_pkey" PRIMARY KEY ("meetId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Meet" ADD CONSTRAINT "Meet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetsParticipants" ADD CONSTRAINT "MeetsParticipants_meetId_fkey" FOREIGN KEY ("meetId") REFERENCES "Meet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetsParticipants" ADD CONSTRAINT "MeetsParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
