import { Migration } from '@mikro-orm/migrations';

export class Migration20231230000059 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_tours" ("user_id" uuid not null, "tour_id" uuid not null);',
    );
    this.addSql(
      'alter table "user_tours" add constraint "user_tours_pkey" primary key ("user_id", "tour_id");',
    );

    this.addSql(
      'alter table "user_tours" add constraint "user_tours_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_tours" add constraint "user_tours_tour_id_foreign" foreign key ("tour_id") references "tour" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_tours" cascade;');
  }
}
