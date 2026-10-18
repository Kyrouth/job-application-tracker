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
import { signUp } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { JSX, useState } from "react";

type SignUpProperties = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function SignUp(): JSX.Element {
    const [properties, setProperties] = useState<SignUpProperties>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        if(properties.confirmPassword != properties.password) {
            setError("Confirm password is incorrect");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await signUp.email({
                name: properties.name,
                email: properties.email,
                password: properties.password,
            });

            if (result.error)
                setError(result.error.message || "Failed to sing up");
            else router.push("/dashboard");
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    function handleInputs(e: React.ChangeEvent<HTMLInputElement>) {
        setProperties((prev) => ({ ...prev, [e.target.name]: e.target.value }));;
    }
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-black">
                        Sign Up
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Create an account to start tracking your job
                        applications
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
                            <Label htmlFor="name" className="text-gray-700">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                                value={properties.name}
                                onChange={handleInputs}
                            />
                        </div>
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
                        <div className="space-y-2">
                            <Label
                                htmlFor="confirm-password"
                                className="text-gray-700"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={8}
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                                onChange={handleInputs}
                                value={properties.confirmPassword}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </Button>
                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                className="font-medium text-primary hover:underline"
                                href="/account/sign-in"
                            >
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
