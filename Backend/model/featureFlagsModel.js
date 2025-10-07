//in this file initialize the table (when starting server)
//and query to insert the tuple inside the table


import pool from '../config/db.js' ;

export const initializeFeatureFlagTable = async() =>{
    const query = `
        create table if not exists feature_flag(
            id serial primary key,
            name varchar(100) unique Not null,
            description text,
            rollout_percentage int check(rollout_percentage >=0 and rollout_percentage<=100),
            is_active boolean default true,
            created_at timestamp default current_timestamp,
            updated_at timestamp default current_timestamp 
        );
    `; 
    await pool.query(query) ; 

    console.log("feature_flag table created successfully");
}

// Insert new flag
export const insertFlag = async ({ name, description, rolloutPercentage }) => {//js ke time me camelCase use , db ke time me snake_case use(but,mapping sahi se karna)
  const query = `
    INSERT INTO feature_flag(name, description, rollout_percentage)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [name, description, rolloutPercentage];
  const result = await pool.query(query, values);  //upar me $1,$2,$3 values are taken from values array
  return result.rows[0];
};

export const getAllFlag = async() =>{
    const query = `select * from feature_flag`;
    const result = await pool.query(query) ; 
    return result.rows 
}


//find a particular flag 
export const findWithId = async(_id) =>{
        const query = 'select * from feature_flag where id=$1';
        const result = await pool.query(query, [_id]) //now,this [] contains _id so, $1 will be _id in the upper query
        return result.rows[0] 
}
