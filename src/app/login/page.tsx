import { login, signup } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <form className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md space-y-6">
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between space-x-4">
        <Button
          formAction={login}
          className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Log in
        </Button>
        <Button
          formAction={signup}
          className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Sign up
        </Button>
      </div>
    </form>
  )
}