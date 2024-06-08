"use client";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import EmailCard from "@/components/EmailCard";
import Link from "next/link";
import EmailView from "@/components/EmailView";
import { getEmailData, getLastEmailsData } from "../server-actions";
import OpenAI from "openai";

var openAIKey: string;
if (typeof window !== "undefined") {
  openAIKey = localStorage.getItem("openai_key") as string;
}

async function classifyEmail(text: string) {
  const openai = new OpenAI({
    apiKey: openAIKey,
    dangerouslyAllowBrowser: true,
  });
  return await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You will be provided with an email, and your task is to tag it as important, spam, marketing, promotion, social, or general.",
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.7,
    max_tokens: 64,
    top_p: 1,
  });
}

const LocalClassifiedEmails = {
  get: function () {
    return JSON.parse(localStorage.getItem("classified_emails") || "{}");
  },
  set: function (v: Object) {
    localStorage.setItem("classified_emails", JSON.stringify(v));
  },
};

export default function EmailsPage() {
  const { data: session } = useSession();
  if (!openAIKey) redirect("/");

  const searchParams = useSearchParams();
  let selectedEmailID = parseInt(searchParams.get("id") as string);

  const [selectedEmailsNum, setSelectedEmailsNum] = useState(15);
  const [emails, setEmails] = useState([]);
  const loaderRef = useRef();

  function showLoader(v: boolean = true) {
    if (loaderRef.current) {
      if (v) {
        loaderRef.current.style.display = "inline-block";
      } else {
        loaderRef.current.style.display = "none";
      }
    }
  }

  async function onClassify() {
    showLoader();

    const localClassifiedEmails = LocalClassifiedEmails.get();

    const classifiedEmails = [];
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      if (email.id in localClassifiedEmails) {
        classifiedEmails.push({
          ...email,
          classification: localClassifiedEmails[email.id],
        });
      } else {
        try {
          const emailClass = await classifyEmail(email.message);
          classifiedEmails.push({ ...email, classification: emailClass });
          localClassifiedEmails[email.id] = emailClass;
        } catch (error) {
          alert(error);
          showLoader(false);
          return;
        }
      }
    }

    setEmails(classifiedEmails);
    LocalClassifiedEmails.set(localClassifiedEmails);

    showLoader(false);
  }

  useEffect(() => {
    showLoader();

    getLastEmailsData(selectedEmailsNum).then(async (emailsData) => {
      const _emails = [];
      const localEmails = JSON.parse(localStorage.getItem("emails") || "{}");

      for (let i = 0; i < emailsData.length; i++) {
        let emailID = emailsData[i].id;
        if (emailID in localEmails) {
          _emails.push(localEmails[emailID]);
        } else {
          let email = await getEmailData(emailID);
          let message = "";
          if (email.payload?.parts) {
            message = atob(
              email.payload.parts[0].body.data
                .replace(/-/g, "+")
                .replace(/_/g, "/")
            );
          } else {
            message = atob(
              email.payload.body.data.replace(/-/g, "+").replace(/_/g, "/")
            );
          }

          email = {
            id: emailID,
            snippet: email.snippet,
            subject: email.payload.headers.filter(
              (v) => v.name === "Subject"
            )[0].value,
            from: email.payload.headers.filter((v) => v.name === "From")[0]
              .value,
            message: message,
          };

          localEmails[emailID] = email;
          const localClassifiedEmails = LocalClassifiedEmails.get();
          if (emailID in localClassifiedEmails) {
            email.classification = localClassifiedEmails[emailID];
          }
          _emails.push(email);
        }
      }

      setEmails(_emails);
      localStorage.setItem("emails", JSON.stringify(localEmails));
      showLoader(false);
    });
  }, [selectedEmailsNum]);

  if (session) {
    return (
      <>
        <div className="mt-16 pt-2 max-w-4xl mx-auto">
          <div className="relative">
            <select
              name="emails-number"
              className="px-2 py-1 outline-none bg-white"
              value={selectedEmailsNum}
              onChange={(e) => setSelectedEmailsNum(e.target.value)}
            >
              {[...Array(100).keys()].map((i) => (
                <option key={i}>{i + 1}</option>
              ))}
            </select>
            <span
              ref={loaderRef}
              className="absolute left-0 right-0 mx-auto text-sm w-fit mt-1"
            >
              Loading...
            </span>
            <button
              onClick={onClassify}
              className="absolute right-1 px-4 py-1 bg-white border font-semibold text-sm"
            >
              Classify
            </button>
          </div>
          <div className="p-1 mt-2 h-[83vh] overflow-y-auto">
            {emails.map((email, index) => (
              <Link href={"?id=" + index} key={index}>
                <EmailCard data={email} key={index} />
              </Link>
            ))}
          </div>
        </div>

        {!Number.isNaN(selectedEmailID) &&
          emails.length >= selectedEmailID + 1 && (
            <EmailView data={emails[selectedEmailID]} />
          )}
      </>
    );
  }
}
