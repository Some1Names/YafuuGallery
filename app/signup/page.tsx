"use client";

import React, { useState,useEffect } from "react";
import axios from "axios";
import { TestDTO } from "@/domain/test";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
   const payload: TestDTO = { name, email };
   const res = axios.post("/api/data", payload);
    setSubmitted(true);
  }

  const getData = async () => {
    const res = await axios.get("/api/data");
    setData(res.data.message);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">Sign Up Account</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Enter your personal information to create an account.
          </p>
          <p className="text-black">{data[0]?.email}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5 shadow-sm"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="eg. John Doe"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="eg. you@example.com"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-neutral-900 text-white text-sm font-medium py-2.5 hover:bg-neutral-800 transition"
          >
            Sign Up
          </button>

          {submitted && (
            <p className="text-sm text-green-600 text-center">
              Account created successfully: {name} ({email})
            </p>
          )}
        </form>
      </div>
    </div>
  );
}