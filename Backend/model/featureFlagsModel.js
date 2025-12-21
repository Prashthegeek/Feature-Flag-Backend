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
            is_deleted boolean default false, 
            created_at timestamp default current_timestamp,
            updated_at timestamp default current_timestamp 
        );
    `; 
    await pool.query(query) ; 

    console.log("feature_flag table created successfully");
}

// Insert new flag
export const insertFlag = async ({ name, description, rollout_percentage }) => {
  const query = `
    INSERT INTO feature_flag(name, description, rollout_percentage)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [name, description, rollout_percentage];
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
        const result = await pool.query(query, [_id]) //now,this [] contains _id so, $1 will be _id in the upper query(not $0)
        return result.rows[0] 
}


export const updateFlag = async(id , filteredObj) =>{
    const keys = Object.keys(filteredObj) //returns an array with all keys

    //if i want to use $1 ,$2 in the query then -> i need to have keys and their corresponding values in an ordered format 
    //currently, we have  filteredObj (object) (where order doesn't matter) , so ,create array of both keys and values (keys already done)
    const values = Object.values(filteredObj)

    if(keys.length == 0 ||values.length==0) {
        throw new Error('no fields to update') //handled by try-catch of calling func
    }
    //suppose filteredObj = {name :'prash' , description : 'anything'}
    // UPDATE feature_flag
    // SET  name=${1} , description={$2}, updated_at = CURRENT_TIMESTAMP
    //so,this is the update function we want to have 

    //while running query , seocnd arguemnt which contains an array (ex-> await pool.query(query , [this array must have values which will be pointed as $1 and $2 in query string]
    // so,this can be done using -> values array we have 

    //but, issue, is in query string -> how can i have -> name= ${1} and description={2} ,because ,i don't know ki filteredObj me yahi dono
    //field hai ya kuchh aur , so, craete dynamic set clause like ->   "name = $1, is_active = $2"

    const setClause = keys.map((key, idx) =>{
        return `${key}=$${idx+1}`
    }).join(",") //finally, setClause => name = $1, is_active = $2 (string format because of join)
   

    const query = `
        update feature_flag set ${setClause} , updated_at = current_timestamp where id= $${values.length +1} And is_deleted = false
        Returning * 
    ` ;  //RETURNING *, we are instructing PostgreSQL to return all the  updated rows or all the selected rows (depends on the query which it run ,all the affected rows will be returned in an array format ).

    const result = await pool.query(query , [...values , id]) 
    return result.rows[0] 
}


//well, two options -> either delete whole row (hard delete) (but, hard delete won't help in analytics) 
//soft delete -> just make this flag as inactive ,so ,is_active= false and also make is_deleted = true (so, afterwards no one can update it)
export const deleteFlag = async(id) =>{  
    const query = `update feature_flag set is_active= false , is_deleted = true, updated_at=current_timestamp where id=$1 AND is_deleted = false 
        Returning *;
    `;  //so, just updating ,if already is_active is false (then->dont give success message)
    const result = await pool.query(query , [id])
    return result.rows[0] ; 
}

