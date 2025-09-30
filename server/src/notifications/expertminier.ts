// expertminier.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('expertminier') // Use the actual table name
export class Expert{
  @PrimaryGeneratedColumn()
  id_expert: number;

  @Column({ type: 'varchar', nullable: true })
  nom_expert: string;

  @Column({ type: 'varchar', nullable: true })
  num_agrement: string;

  @Column({ type: 'timestamp', nullable: true })
  date_agrement: Date;

  @Column({ type: 'varchar', nullable: true })
  etat_agrement: string;

  @Column({ type: 'varchar', nullable: true })
  adresse: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  tel_expert: string;

  @Column({ type: 'varchar', nullable: true })
  fax_expert: string;

  @Column({ type: 'varchar', nullable: true })
  specialisation: string;
}