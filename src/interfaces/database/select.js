const log = require("../../util/logger");
const db = require('../../util/PostgresHelper');

module.exports = {
    /**
     * Requette de selection d'un utilisateur par sont id discord
     * @param {String} discordID
     * @return {Promise<*|HTMLTableRowElement|string>}
     */
    async getUserFromDiscordID(discordID){
        let data = await db.query(`
            SELECT * 
            FROM USERS 
            FULL OUTER JOIN organisations on organisations."organisationSID" = users."organisationSID"
            WHERE "discordID" = $1`,[discordID]);
        return data.rows[0]
    },
    /**
     * Requete de selection d'un membre par son handle
     * @param {String} handle
     * @return {Promise<*|HTMLTableRowElement|string>}
     */
    async getUserFromHandle(handle){
        let data = await db.query(`
            SELECT * 
            FROM USERS 
            FULL OUTER JOIN organisations on organisations."organisationSID" = users."organisationSID"
            WHERE lower(handle) = lower($1)`,[handle]);
        return data.rows[0]
    },
    /**
     * Requet permettant de verifier si un utilisateur et présent dans la BDD par sont iddiscord
     * @param {String} discordID
     * @return {Promise<boolean>}
     */
    async isRegisterFromDiscordID(discordID){
        let data = await db.query(`
            SELECT count(*) 
            FROM USERS 
            WHERE "discordID" = $1`,[discordID]);
        let count = parseInt(data.rows[0].count,10)
        if (count===0){
            return false
        }else if(count===1){
            return true
        }else {
            return log.warn('Un iddiscord est enregistrer plus de une fois dans la BDD ce n\'est normalement pas possible')
        }
    },
    /**
     * Requet permettant de verifier si un utilisateur et présent dans la BDD par sont iddiscord
     * @param {String} handle
     * @return {Promise<boolean>}
     */
    async isRegisterFromHandle(handle){
        let data = await db.query(`
            SELECT count(*) 
            FROM USERS 
            WHERE lower(handle) = lower($1)`,[handle]);
        let count = parseInt(data.rows[0].count,10)
        if (count===0){
            return false
        }else if(count===1){
            return true
        }else {
            return log.warn('Un handle est enregistrer plus de une fois dans la BDD ce n\'est normalement pas possible')
        }
    },
    /**
     * Renvoie les lang parler par un utilisateur depuis sont iddiscord
     * @param  {String} discordID
     * @return {Promise<[String]>}
     */
    async getUserLangFromDiscordID(discordID){
        let data = await db.query(`
            select lang from users
            inner join speak ON speak."userID" = users."userID"
            inner join lang ON lang."langID" = speak."langID"
            where "discordID" = $1`,[discordID]);

        let returnedLang = []
        for(let lang of data.rows){
            returnedLang.push(lang.lang)
        }
        return returnedLang
    },
    /**
     * Renvoie les lang parler par un utilisateur depuis sont handle
     * @param  {String} handle
     * @return {Promise<[String]>}
     */
    async getUserLangFromHandle(handle){
        let data = await db.query(`
            select lang from users
            inner join speak ON speak."userID" = users."userID"
            inner join lang ON lang."langID" = speak."langID"
            where lower(handle) = lower($1)`,[handle]);
        let returnedLang = []
        for(let lang of data.rows){
            returnedLang.push(lang.lang)
        }
        return returnedLang
    }

}