"use client";

import { useState } from "react";
import { Input } from "@/components/input/input";
import { Label } from "@/components/label/label";
import { Card, Button, Text, Alert, Title } from "@mantine/core";

import { CheckCircle, TestTube, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TestTransactionCard = () => {
  const [gateway, setGateway] = useState("stripe");
  const [currency, setCurrency] = useState("usd");

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="bg-slate-200/70 dark:bg-slate-950/50 dark:text-slate-100"
    >
      <div className="mb-4">
        <Title order={4} className="text-base sm:text-lg">
          Test Transaction
        </Title>
        <Text c="dimmed" size="sm" className="text-xs sm:text-sm">
          Perform a test transaction to validate the complete flow
        </Text>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-gateway" className="text-sm sm:text-base">
            Payment Gateway
          </Label>
          <Select
            value={gateway}
            onValueChange={setGateway}
            defaultValue="stripe"
          >
            <SelectTrigger className="w-full px-3 py-2 text-sm sm:text-base border rounded-md flex justify-between items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select gateway to test" />
              <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
            </SelectTrigger>
            <SelectContent className=" bg-white dark:text-slate-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md">
              <SelectItem
                value="stripe"
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              >
                Stripe
              </SelectItem>
              <SelectItem
                value="paypal"
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              >
                PayPal
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="test-amount" className="text-sm sm:text-base">
            Test Amount
          </Label>
          <Input
            id="test-amount"
            placeholder="10.00"
            className="text-sm sm:text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="test-currency" className="text-sm sm:text-base">
            Currency
          </Label>
          <Select
            value={currency}
            onValueChange={setCurrency}
            defaultValue="usd"
          >
            <SelectTrigger className="w-full px-3 py-2 text-sm sm:text-base border rounded-md flex justify-between items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select currency" />
              <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
            </SelectTrigger>
            <SelectContent className="dark:text-slate-100 bg-white z-10 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md">
              <SelectItem
                value="usd"
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              >
                USD
              </SelectItem>
              <SelectItem
                value="eur"
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              >
                EUR
              </SelectItem>
              <SelectItem
                value="cup"
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              >
                CUP
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full text-slate-100 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-sm sm:text-base py-2 sm:py-3">
          <TestTube className="size-4" />
          Run Test Transaction
        </Button>

        <Alert
          icon={<CheckCircle className="h-4 w-4" />}
          className="bg-blue-50 dark:text-slate-100 z-0 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-900 text-xs sm:text-sm"
        >
          Last test transaction successful - $10.00 {currency.toUpperCase()} via{" "}
          <span className="capitalize">{gateway}</span> (Test Mode)
        </Alert>
      </div>
    </Card>
  );
};
