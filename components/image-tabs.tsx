"use client"

import { JSX } from "react";
import Image from "next/image";

import { useState } from "react";
import { Button } from "./ui/button";
enum ImageTabsOptions {
    Organize,
    Hired,
    Boards,
}

export default function ImageTabs(): JSX.Element {
    const [activeTab, setActiveTab] = useState<ImageTabsOptions>(ImageTabsOptions.Organize);

    return (
        <section className="border-t bg-white py-16">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-6xl">
                    {/* Tabs */}
                    <div className="flex gap-2 justify-center mb-8">
                        <Button
                            className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === ImageTabsOptions.Organize
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => {
                                setActiveTab(ImageTabsOptions.Organize);
                            }}
                        >
                            Organize Applications
                        </Button>
                        <Button
                            className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === ImageTabsOptions.Hired
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => {
                                setActiveTab(ImageTabsOptions.Hired);
                            }}
                        >
                            Get Hired
                        </Button>
                        <Button
                            className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === ImageTabsOptions.Boards
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => {
                                setActiveTab(ImageTabsOptions.Boards);
                            }}
                        >
                            Manage boards
                        </Button>
                    </div>

                    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl">
                        {activeTab === ImageTabsOptions.Organize && (
                            <Image
                                src="/hero-images/hero1.png"
                                alt="Organize Applications"
                                width={1200}
                                height={800}
                            />
                        )}

                        {activeTab === ImageTabsOptions.Hired && (
                            <Image
                                src="/hero-images/hero2.png"
                                alt="Get Hired"
                                width={1200}
                                height={800}
                            />
                        )}

                        {activeTab === ImageTabsOptions.Boards && (
                            <Image
                                src="/hero-images/hero3.png"
                                alt="Manage boards"
                                width={1200}
                                height={800}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
