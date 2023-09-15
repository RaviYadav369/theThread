import mongoose from 'mongoose'

let isConneted = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery',true);

    if(!process.env.MONGO_URI) return console.log('Missing MongoDB Url');
    
    if(isConneted) return console.log('Already Connected To Database');

    try {
        await mongoose.connect(process.env.MONGO_URI)
        isConneted= true;
        console.log('Connected To DataBase');
        
        
    } catch (error) {
        console.log(error);
        
    }
    
}