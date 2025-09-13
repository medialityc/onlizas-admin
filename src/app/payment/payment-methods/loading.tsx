import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import { Box, Card } from "@mantine/core";

export default function Loading() {
  return (
    <Box className="mx-auto max-w-[100rem] animate-pulse">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Payment Methods</h2>
        <p>Configure which payment methods are available to customers</p>
      </div>

      <Card className="bg-gray-200/70 dark:bg-gray-950 dark:text-slate-100 shadow-lg rounded-lg">
        <CardHeader className="p-4">
          <CardTitle className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded-sm mb-2" />
          <CardDescription className="h-4 w-80 bg-gray-300 dark:bg-gray-700 rounded-sm" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-5 border rounded-lg bg-white dark:bg-slate-900"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-5 w-5 bg-gray-400 dark:bg-gray-600 rounded-sm animate-pulse" />
                  <div className="h-6 w-14 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse" />

                  <div className="flex flex-col space-y-2">
                    <div className="h-5 w-28 bg-gray-400 dark:bg-gray-600 rounded-sm animate-pulse" />
                    <div className="h-4 w-36 bg-gray-400 dark:bg-gray-600 rounded-sm animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="h-6 w-14 bg-gray-400 dark:bg-gray-600 rounded-sm animate-pulse" />
                  <div className="h-9 w-9 bg-gray-400 dark:bg-gray-600 rounded-sm animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="h-10 w-full  bg-gray-400 dark:bg-gray-600 rounded-sm animate-pulse" />
        </CardContent>
      </Card>
    </Box>
  );
}
