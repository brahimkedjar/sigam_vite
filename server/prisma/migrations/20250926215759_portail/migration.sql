-- CreateTable
CREATE TABLE "PortalPermitType" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "regime" TEXT,
    "initialYears" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalPermitType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalDocumentDefinition" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "format" TEXT,
    "maxSizeMB" INTEGER,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "missingAction" "MissingAction" NOT NULL DEFAULT 'BLOCK_NEXT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalDocumentDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalTypeDocument" (
    "id" SERIAL NOT NULL,
    "permitTypeId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    "order" INTEGER,
    "notes" TEXT,

    CONSTRAINT "PortalTypeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalCompany" (
    "id" SERIAL NOT NULL,
    "legalName" TEXT NOT NULL,
    "legalForm" TEXT,
    "rcNumber" TEXT,
    "rcDate" TIMESTAMP(3),
    "nif" TEXT,
    "nis" TEXT,
    "capital" DOUBLE PRECISION,
    "address" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "managerName" TEXT,
    "registryFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalRepresentative" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "function" TEXT,
    "nationalId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "powerDocUrl" TEXT,

    CONSTRAINT "PortalRepresentative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalShareholder" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nif" TEXT,
    "sharePct" DOUBLE PRECISION NOT NULL,
    "nationality" TEXT,

    CONSTRAINT "PortalShareholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalApplication" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "status" TEXT NOT NULL,
    "title" TEXT,
    "permitTypeId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "wilaya" TEXT,
    "daira" TEXT,
    "commune" TEXT,
    "lieuDit" TEXT,
    "polygonGeo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalApplicationDocument" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "fileUrl" TEXT,
    "uploadedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortalApplicationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalPayment" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'DZD',
    "status" TEXT NOT NULL,
    "intentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortalPermitType_code_key" ON "PortalPermitType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PortalDocumentDefinition_code_key" ON "PortalDocumentDefinition"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PortalTypeDocument_permitTypeId_documentId_key" ON "PortalTypeDocument"("permitTypeId", "documentId");

-- CreateIndex
CREATE UNIQUE INDEX "PortalApplication_code_key" ON "PortalApplication"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PortalApplicationDocument_applicationId_documentId_key" ON "PortalApplicationDocument"("applicationId", "documentId");

-- AddForeignKey
ALTER TABLE "PortalTypeDocument" ADD CONSTRAINT "PortalTypeDocument_permitTypeId_fkey" FOREIGN KEY ("permitTypeId") REFERENCES "PortalPermitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalTypeDocument" ADD CONSTRAINT "PortalTypeDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "PortalDocumentDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalRepresentative" ADD CONSTRAINT "PortalRepresentative_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "PortalCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalShareholder" ADD CONSTRAINT "PortalShareholder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "PortalCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalApplication" ADD CONSTRAINT "PortalApplication_permitTypeId_fkey" FOREIGN KEY ("permitTypeId") REFERENCES "PortalPermitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalApplication" ADD CONSTRAINT "PortalApplication_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "PortalCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalApplicationDocument" ADD CONSTRAINT "PortalApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PortalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalApplicationDocument" ADD CONSTRAINT "PortalApplicationDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "PortalDocumentDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalPayment" ADD CONSTRAINT "PortalPayment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PortalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
