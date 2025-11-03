import { User } from "lucide-react";
import { Card, CardHeader, CardContent, CardDescription } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Product Manager</h2>
                <CardDescription>user@example.com</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-sm text-muted-foreground">
                  Profile settings and preferences coming soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
