  import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
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