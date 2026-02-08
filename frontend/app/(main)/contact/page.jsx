"use client";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Get in touch
          </h1>
          <p className="text-stone-600">
            We&apos;d love to hear from you. Please fill out this form.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              Contact Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-stone-900">Email</h3>
                  <p className="text-stone-600">support@servd.ai</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageSquare className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-stone-900">Live Chat</h3>
                  <p className="text-stone-600">Available Mon-Fri, 9am-5pm</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-stone-900">Office</h3>
                  <p className="text-stone-600">
                    123 Innovation Dr, Tech City, TC 90210
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1 block">
                    First name
                  </label>
                  <Input placeholder="Jane" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1 block">
                    Last name
                  </label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1 block">
                  Email
                </label>
                <Input type="email" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1 block">
                  Message
                </label>
                <Textarea placeholder="How can we help you?" />
              </div>
              <Button className="w-full bg-stone-900 hover:bg-stone-800">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
