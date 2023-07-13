import dotenv from "dotenv";
dotenv.config();
export default function boot() {
  //boot
}

boot.end = (code: number, message: string) => {
  if (code == 0) {
    console.log(message);
  } else {
    console.error(message);
  }
  process.exit(code);
};
