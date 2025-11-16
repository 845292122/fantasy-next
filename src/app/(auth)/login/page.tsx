import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="w-md h-4/6 px-10 pt-10 lg:shadow-2xl rounded-lg lg:border lg:border-gray-100 lg:ml-20">
      <h1 className="font-bold text-2xl mb-10">哈喽,欢迎回来! 🐰</h1>
      <LoginForm />
    </div>
  )
}
