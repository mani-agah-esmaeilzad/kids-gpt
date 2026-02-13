"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Sparkles, Wand2, ArrowLeft, Bot, MessageSquare } from "lucide-react";
import { KidCard } from "@/components/shared/kid-card";
import { MascotHeader } from "@/components/shared/mascot-header";

export default function UIKitPage() {
    return (
        <div className="container py-12 space-y-12 rtl-scrollbar">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">GPTKids Design System</h1>
                <p className="text-lg text-muted-foreground">Unified design language for Kid, Parent, and Marketing experiences.</p>
            </div>

            <Tabs defaultValue="base" className="space-y-8">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                    <TabsTrigger value="base">Base</TabsTrigger>
                    <TabsTrigger value="kid">Kid Mode</TabsTrigger>
                    <TabsTrigger value="parent">Parent Mode</TabsTrigger>
                </TabsList>

                {/* --- BASE COMPONENTS --- */}
                <TabsContent value="base" className="space-y-12">

                    {/* Colors */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b pb-2">Colors (Theme Aware)</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {[
                                { name: "Primary", class: "bg-primary text-primary-foreground" },
                                { name: "Secondary", class: "bg-secondary text-secondary-foreground" },
                                { name: "Accent", class: "bg-accent text-accent-foreground" },
                                { name: "Destructive", class: "bg-destructive text-destructive-foreground" },
                                { name: "Muted", class: "bg-muted text-muted-foreground" },
                                { name: "Card", class: "bg-card text-card-foreground border" },
                            ].map((color) => (
                                <div key={color.name} className={`h-24 rounded-2xl flex items-center justify-center p-4 text-center shadow-sm ${color.class}`}>
                                    <span className="font-semibold text-sm">{color.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Typography */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b pb-2">Typography (Vazirmatn)</h2>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Heading 1</p>
                                <h1 className="text-4xl font-extrabold tracking-tight">چت‌بات هوش مصنوعی امن</h1>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Heading 2</p>
                                <h2 className="text-3xl font-semibold tracking-tight">آخرین فعالیت‌های کودک</h2>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Heading 3</p>
                                <h3 className="text-2xl font-semibold tracking-tight">تنظیمات پیشرفته</h3>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Body</p>
                                <p className="leading-7">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Small / Caption</p>
                                <p className="text-sm text-muted-foreground">این یک متن توضیحی کوچک است.</p>
                            </div>
                        </div>
                    </section>

                    {/* Buttons */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b pb-2">Buttons</h2>
                        <div className="flex flex-wrap gap-4">
                            <Button>Original Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="link">Link Style</Button>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Button size="sm">Small</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large Scale</Button>
                            <Button size="icon"><Sparkles className="w-4 h-4" /></Button>
                        </div>
                    </section>

                    {/* Inputs & Forms */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b pb-2">Inputs & Form Controls</h2>
                        <div className="grid max-w-sm gap-4">
                            <div className="space-y-2">
                                <Label>Email input</Label>
                                <Input type="email" placeholder="example@gmail.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input type="password" placeholder="••••••••" />
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Switch id="airplane-mode" />
                                <Label htmlFor="airplane-mode">حالت هواپیما</Label>
                            </div>
                        </div>
                    </section>
                </TabsContent>

                {/* --- KID MOOD --- */}
                <TabsContent value="kid" className="space-y-12">
                    <div className="p-6 bg-kid-blue/10 rounded-3xl border border-kid-blue/20">
                        <h3 className="text-2xl font-bold text-kid-blue mb-6">Kid-Friendly Palette & Components</h3>

                        {/* Kid Colors */}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                            {[
                                { name: "Blue", c: "bg-kid-blue" },
                                { name: "Pink", c: "bg-kid-pink" },
                                { name: "Yellow", c: "bg-kid-yellow" },
                                { name: "Green", c: "bg-kid-green" },
                                { name: "Purple", c: "bg-kid-purple" },
                                { name: "Orange", c: "bg-kid-orange" },
                            ].map((c) => (
                                <div key={c.name} className={`${c.c} h-20 rounded-2xl shadow-sm flex items-center justify-center`}>
                                    <span className="font-bold text-white drop-shadow-md">{c.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Kid Components */}
                        <div className="space-y-8">
                            <section>
                                <h4 className="text-lg font-semibold mb-4">Mascot Header</h4>
                                <div className="bg-white rounded-2xl overflow-hidden shadow-soft border">
                                    <MascotHeader
                                        title="سلام علی عزیز! 👋"
                                        subtitle="امروز می‌خوای در مورد چی بدونی؟"
                                    />
                                </div>
                            </section>

                            <section>
                                <h4 className="text-lg font-semibold mb-4">Kid Interaction Cards</h4>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <KidCard
                                        variant="blue"
                                        title="دایناسورها"
                                        description="بیا در مورد تی‌رکس صحبت کنیم!"
                                        icon={<Wand2 className="w-8 h-8 text-white" />}
                                        onClick={() => { }}
                                    />
                                    <KidCard
                                        variant="pink"
                                        title="داستان شب"
                                        description="یک قصه جادویی بگو..."
                                        icon={<Sparkles className="w-8 h-8 text-white" />}
                                        onClick={() => { }}
                                    />
                                    <KidCard
                                        variant="green"
                                        title="سوال علمی"
                                        description="چرا آسمان آبی است؟"
                                        icon={<Bot className="w-8 h-8 text-white" />}
                                        onClick={() => { }}
                                    />
                                </div>
                            </section>
                        </div>
                    </div>
                </TabsContent>

                {/* --- PARENT MOOD --- */}
                <TabsContent value="parent" className="space-y-12">
                    <div className="p-6 bg-slate-50 rounded-3xl border">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Parent SaaS Palette & Components</h3>

                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="shadow-soft">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-primary" />
                                        وضعیت ایمنی
                                    </CardTitle>
                                    <CardDescription>گزارش هفتگی فعالیت‌ها</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg border border-green-100">
                                        <span className="font-medium">همه چیز امن است</span>
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">پیام‌های امروز</span>
                                            <span className="font-bold">24 / 50</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[48%]" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-soft">
                                <CardHeader>
                                    <CardTitle>مدیریت اشتراک</CardTitle>
                                    <CardDescription>پلن فعلی: خانواده (حرفه‌ای)</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-6">
                                        <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Active</Badge>
                                        <span className="text-sm text-muted-foreground">تمدید: ۱۴ روز دیگر</span>
                                    </div>
                                    <Button className="w-full" variant="outline">
                                        مشاهده فاکتورها
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
}
