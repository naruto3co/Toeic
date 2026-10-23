import {createInterface} from 'node:readline/promises';
import {Writable} from 'node:stream';
export async function passwordInput(){
 if(!process.stdin.isTTY){let text='';for await(const chunk of process.stdin)text+=chunk;const [password,confirm]=text.split(/\r?\n/);if(password!==confirm)throw new Error('Hai mật khẩu không khớp.');return password;}
 const output=new Writable({write(chunk,encoding,done){done();}}),input=createInterface({input:process.stdin,output,terminal:true});
 try{process.stdout.write('Mật khẩu mới (tối thiểu 12 ký tự, không hiện khi nhập): ');const password=await input.question('');process.stdout.write('\nNhập lại mật khẩu: ');const confirm=await input.question('');process.stdout.write('\n');if(password!==confirm)throw new Error('Hai mật khẩu không khớp.');return password;}finally{input.close();}
}
