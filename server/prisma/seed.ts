import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as bcrypt from 'bcrypt';



async function main6() {
  await prisma.membresComite.createMany({
    data: [
      {
        id_membre: 1,
        nom_membre: "Ali",
        prenom_membre: "Yahia",
        fonction_membre: "Président",
        email_membre: "ali@example.com",
      },
      {
        id_membre: 2,
        nom_membre: "Sara",
        prenom_membre: "Bensalah",
        fonction_membre: "Membre",
        email_membre: "sara@example.com",
      },
      {
        id_membre: 3,
        nom_membre: "Karim",
        prenom_membre: "Benali",
        fonction_membre: "Rapporteur",
        email_membre: "karim@example.com",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Membres du comité seeded.");
}

main6()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());


  async function main8() {
  await prisma.role.createMany({
    data: [
      { name: 'admin' },
      { name: 'cadastre' },
      { name: 'controle' },
      { name: 'ddm' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Roles seeded');
}

main8()
  .catch(console.error)
  .finally(() => prisma.$disconnect());



async function main9() {
  const permissions = await prisma.permission.createMany({
    data: [
      { name: 'view_dashboard' },
      { name: 'create_demande' },
      { name: 'manage_users' },
      { name: 'permis-dashboard'},
      { name: 'Admin-Panel'},
      { name: 'view_procedures'},
      { name: 'controle_minier'},
      { name: 'dashboard'},
      { name: 'Payments'},
      { name: 'manage_documents'},
      { name: 'Audit_Logs'}

    ],
    skipDuplicates: true,
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });

  const allPermissions = await prisma.permission.findMany();

  // Link all permissions to admin
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Link only view_dashboard to user
  const viewDashboard = await prisma.permission.findFirst({
    where: { name: 'view_dashboard' },
  });

  if (viewDashboard) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: viewDashboard.id,
        },
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: viewDashboard.id,
      },
    });
  }

  

  console.log('✅ Seed complete');
}

main9().catch((e) => console.error(e)).finally(() => prisma.$disconnect());




async function main11() {
  // Create TypePermis
  // const typePermis = await prisma.typePermis.createMany({
  //   data: [
  //     // Mining Permits
  //     {
  //       id_taxe:1,
  //       lib_type: 'Permis de prospection',
  //       code_type: 'PPM',
  //       regime: 'mine',
  //       duree_initiale: 3,
  //       nbr_renouv_max: 2,
  //       duree_renouv: 1/2,
  //       delai_renouv: 90,
  //       superficie_max: 100
  //     },
  //     {
  //       id_taxe:2,
  //       lib_type: 'Permis d\'exploration',
  //       code_type: 'PEM',
  //       regime: 'mine',
  //       duree_initiale: 5,
  //       nbr_renouv_max: 1,
  //       duree_renouv: 2,
  //       delai_renouv: 180,
  //       superficie_max: 500
  //     },
  //     {
  //       id_taxe:3,
  //       lib_type: 'Permis d\'exploitation',
  //       code_type: 'PEX',
  //       regime: 'mine',
  //       duree_initiale: 25,
  //       nbr_renouv_max: 3,
  //       duree_renouv: 10,
  //       delai_renouv: 365,
  //       superficie_max: 1000
  //     },
  //     {
  //       id_taxe:4,
  //       lib_type: 'Permis de petite mine',
  //       code_type: 'PPM',
  //       regime: 'mine',
  //       duree_initiale: 10,
  //       nbr_renouv_max: 2,
  //       duree_renouv: 0,
  //       delai_renouv: 180,
  //       superficie_max: 50
  //     },
      
  //     // Quarry Permits
  //     {
  //       id_taxe:5,
  //       lib_type: 'Permis de recherche carrière',
  //       code_type: 'PRC',
  //       regime: 'carriere',
  //       duree_initiale: 3,
  //       nbr_renouv_max: 1,
  //       duree_renouv: 10,
  //       delai_renouv: 90,
  //       superficie_max: 50
  //     },
  //     {
  //       id_taxe:6,
  //       lib_type: 'Permis d\'exploitation carrière',
  //       code_type: 'PEC',
  //       regime: 'carriere',
  //       duree_initiale: 15,
  //       nbr_renouv_max: 2,
  //       duree_renouv: 4,
  //       delai_renouv: 180,
  //       superficie_max: 100
  //     },
      
  //     // Artisanal Permits
  //     {
  //       id_taxe:7,
  //       lib_type: 'Autorisation artisanale mine',
  //       code_type: 'ARM',
  //       regime: 'mine',
  //       duree_initiale: 2,
  //       nbr_renouv_max: 3,
  //       duree_renouv: 0,
  //       delai_renouv: 60,
  //       superficie_max: 5
  //     },
  //     {
  //       id_taxe:8,
  //       lib_type: 'Autorisation artisanale carrière',
  //       code_type: 'ARC',
  //       regime: 'carriere',
  //       duree_initiale: 2,
  //       nbr_renouv_max: 3,
  //       duree_renouv: 0,
  //       delai_renouv: 60,
  //       superficie_max: 2
  //     },
      
  //     // Special Permits
  //     {
  //       id_taxe:9,
  //       lib_type: 'Permis de ramassage',
  //       code_type: 'PRA',
  //       regime: 'mine',
  //       duree_initiale: 1,
  //       nbr_renouv_max: 5,
  //       duree_renouv: 0,
  //       delai_renouv: 30,
  //       superficie_max: null
  //     },
  //     {
  //       id_taxe:10,
  //       lib_type: 'Permis de transport',
  //       code_type: 'PTM',
  //       regime: 'mine',
  //       duree_initiale: 5,
  //       nbr_renouv_max: 5,
  //       duree_renouv: 0,
  //       delai_renouv: 90,
  //       superficie_max: null
  //     }
  //   ],
  //   skipDuplicates: true
  // });

  // Create TypeProcedures
//   const typeProcedures = await prisma.typeProcedure.createMany({
//     data: [
//       // Initial Requests
//       { libelle: 'demande', description: 'Demande initiale de permis' },
//       { libelle: 'renouvellement', description: 'Renouvellement de permis' },
      
//       // Modifications
//       { libelle: 'extension', description: 'Extension de superficie ou durée' },
//       { libelle: 'modification', description: 'Modification des conditions' },
//       { libelle: 'fusion', description: 'Fusion de permis' },
//       { libelle: 'division', description: 'Division de permis' },
      
//       // Transfers
//       { libelle: 'transfert', description: 'Transfert de droits' },
//       { libelle: 'cession', description: 'Cession partielle' },
      
//       // Termination
//       { libelle: 'renonciation', description: 'Renonciation au permis' },
//       { libelle: 'retrait', description: 'Retrait administratif' },
      
//       // Special Procedures
//       { libelle: 'regularisation', description: 'Procédure de régularisation' },
//       { libelle: 'recours', description: 'Recours administratif' },
//       { libelle: 'arbitrage', description: 'Demande d\'arbitrage' }
//     ],
//     skipDuplicates: true
//   });

//   console.log('Seed data created successfully');
//   // console.log(`Created ${typePermis.count} TypePermis entries`);
//   console.log(`Created ${typeProcedures.count} TypeProcedure entries`);
}

main11()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  async function main12() {
  const statutsJuridiques = [
    { id_statutJuridique:1 ,code_statut: 'SARL', statut_fr: 'Société à responsabilité limitée', statut_ar: 'شركة ذات مسؤولية محدودة' },
    { id_statutJuridique:2 ,code_statut: 'SPA', statut_fr: 'Société par actions', statut_ar: 'شركة مساهمة' },
    { id_statutJuridique:3 ,code_statut: 'EURL', statut_fr: 'Entreprise unipersonnelle à responsabilité limitée', statut_ar: 'مؤسسة فردية ذات مسؤولية محدودة' },
    { id_statutJuridique:4 ,code_statut: 'SNC', statut_fr: 'Société en nom collectif', statut_ar: 'شركة التضامن' },
    // Add more as needed
  ];
  
  await prisma.statutJuridique.createMany({ data: statutsJuridiques });
  }
  
main12()
.catch(e => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});

