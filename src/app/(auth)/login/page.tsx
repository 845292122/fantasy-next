import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="w-md h-4/6 px-10 pt-10 shadow-2xl rounded-lg border border-gray-100">
      <h1 className="font-bold text-2xl mb-10">哈喽,欢迎回来! 🐰</h1>
      <LoginForm />
    </div>
  )
}
