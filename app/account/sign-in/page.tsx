"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";

type SignInProperties = {
    email: string;
    password: string;
};

export default function SignIn(): JSX.Element {
    const [properties, setProperties] = useState<SignInProperties>({
        email: "",
        password: "",
    });

    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const result = await signIn.email({
                email: properties.email,
                password: properties.password,
            });

            if (result.error)
                setError(result.error.message || "Failed to sing in");
            else router.push("/dashboard");
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    function handleInputs(e: React.ChangeEvent<HTMLInputElement>) {
        setProperties((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-black">
                        Sign In
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Enter your credential to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="John@example.com"
                                required
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                                onChange={handleInputs}
                                value={properties.email}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={8}
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                                onChange={handleInputs}
                                value={properties.password}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>
                        <p className="text-center text-sm text-gray-600">
                            Don{"'"}t have an account?{" "}
                            <Link
                                className="font-medium text-primary hover:underline"
                                href="/account/sign-up"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
