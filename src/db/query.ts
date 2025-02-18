import { eq, ilike, or } from "drizzle-orm";
import { db } from "./index";
import * as table from "../db/schema";

export class User {
    public static get get() {
        async function all() {
            try {
                return await db.select().from(table.users);
            } catch (error) {
                console.error(error);
            }
        }

        async function byId(id: number) {
            try {
                return await db.select().from(table.users)
                    .where(eq(table.users.id, id));
            } catch (error) {
                console.error(error);
            }
        }

        async function byUsername(username: string) {
            try {
                return await db.select().from(table.users)
                    .where(eq(table.users.username, username));
            } catch (error) {
                console.error(error);
            }
        }

        async function search(keyword: string) {
            try {
                return await db.select().from(table.users)
                    .where(or(
                        ilike(table.users.nama, `%${keyword}%`), 
                        ilike(table.users.username, `%${keyword}%`)
                    ));
            } catch (error) {
                console.error(error);
            }
        }

        return { all, byId, byUsername, search };
    }

    public static async create(nama: string, username: string, password: string, hakAkses: "Admin" | "Petugas") {
        try {
            return await db.insert(table.users).values({
                nama,
                username,
                password,
                hakAkses
            });
        } catch (error) {
            console.error(error);
        }
    }

    public static get update() {
        async function data(id: number, nama: string, username: string, hakAkses: "Admin" | "Petugas") {
            try {
                return await db.update(table.users).set({
                    nama,
                    username,
                    hakAkses
                }).where(eq(table.users.id, id));
            } catch (error) {
                console.error(error);
            }
        }

        async function password(id: number, password: string) {
            try {
                return await db.update(table.users).set({
                    password
                }).where(eq(table.users.id, id));
            } catch (error) {
                console.error(error);
            }
        }

        return { data, password };
    }

    public static async delete(id: number) {
        try {
            return await db.delete(table.users)
                .where(eq(table.users.id, id));
        } catch (error) {
            console.error(error);
        }
    }
}
