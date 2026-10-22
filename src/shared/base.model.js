class BaseModel {
  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
  }

  async findById(id) {
    const queryText = `SELECT * FROM ${this.tableName} WHERE id = $1 LIMIT 1;`;
    const result = await this.db.query(queryText, [id]);
    return result.rows[0] || null;
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    
    const queryText = `
      INSERT INTO ${this.tableName} (${keys.join(', ')}) 
      VALUES (${placeholders}) 
      RETURNING *;
    `;
    const result = await this.db.query(queryText, values);
    return result.rows[0];
  }
}

module.exports = BaseModel;
