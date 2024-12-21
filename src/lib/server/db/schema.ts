import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const documentation = sqliteTable('documentation', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	name: text('name').notNull()
});

export const pageGroup = sqliteTable('page_group', {
	id: text('id').primaryKey(),
	documentationId: text('documentation_id')
		.notNull()
		.references(() => documentation.id, { onDelete: 'cascade' }),
	name: text('name').notNull()
});

export const page = sqliteTable('page', {
	id: text('id').primaryKey(),
	pageGroupId: text('page_group_id')
		.notNull()
		.references(() => pageGroup.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	markdownContent: text('markdown_content')
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Documentation = typeof documentation.$inferSelect;
export type PageGroup = typeof pageGroup.$inferSelect;
export type Page = typeof page.$inferSelect;
