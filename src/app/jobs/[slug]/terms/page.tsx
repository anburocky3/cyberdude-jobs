import { auth } from "@/auth";
import Alert from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { CheckIcon, CheckLine, CheckSquare, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function TermsPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();

  const { slug } = params;
  const job = await apiFetch(`/api/jobs/${slug}`, {
    cache: "no-store",
  }).then((r) => (r.ok ? r.json() : null));

  if (!job) return notFound();

  if (job.type === "fulltime") {
    redirect(`/jobs/${params.slug}`);
  }

  return (
    <main className="container mx-auto py-6 px-4 max-w-3xl">
      <div className="flex items-center gap-3  mb-4">
        <Link
          href={`/jobs/${params.slug}`}
          className="text-sm text-orange-600 hover:text-orange-700"
        >
          <Button
            variant="ghost"
            size="sm"
            className="mb-1 cursor-pointer"
            title="Return to job"
          >
            <ChevronLeft className="h-10 w-10" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Internship Terms & Conditions</h1>
      </div>
      {/* <div className="prose max-w-none text-gray-800 border rounded bg-yellow-500 p-5">
        <p>
          Please read these terms carefully. By proceeding, you agree to the
          following:
        </p>
      </div> */}

      <div className="prose max-w-none text-gray-800 bg-white border rounded p-5 mt-6">
        <p>
          The program is designed to provide a rigorous, hands-on learning
          experience, focusing on practical skill development and professional
          growth. By accepting this internship offer, you agree to adhere to the
          policies and expectations detailed below.
        </p>

        <h3 className="font-semibold mt-4">1. Program Structure & Objective</h3>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Duration:</strong> The internship is for a fixed term of six
            (6) months.
          </li>
          <li>
            <strong>Compensation:</strong> This is a non-stipendiary (unpaid)
            internship. The primary focus is on skill acquisition, practical
            experience, and mentorship, which we consider to be the core value
            provided to the intern.
          </li>
          <li>
            <strong>Learning Focus:</strong> The program incorporates extensive
            training in both technical and soft skills. Interns are encouraged
            to review our{" "}
            <a
              href="https://bit.ly/cyberdude-internship-videos"
              target="_blank"
              className="text-orange-700 hover:text-orange-800"
            >
              existing public internship sessions on YouTube
            </a>{" "}
            channel to understand the learning methodology and environment.
          </li>
        </ul>

        <h3 className="font-semibold mt-4">2. Work Commitment & Schedule</h3>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Working Hours:</strong> Interns are expected to commit
            approximately 6-8 hours per day, Monday through Friday, during
            standard business hours.
          </li>
          <li>
            <strong>Flexibility & Task Ownership:</strong> While core hours are
            structured, interns are expected to manage their time effectively to
            meet project deadlines. Some tasks may require work during personal
            time to ensure timely completion.
          </li>
          <li>
            <strong>Weekend Meetings:</strong> Occasional mandatory meetings or
            workshops may be scheduled on weekends to accommodate project
            milestones or special training sessions. Advance notice will be
            provided.
          </li>
        </ul>

        <h3 className="font-semibold mt-4">
          3. Performance, Evaluation & Conduct
        </h3>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Performance Standards:</strong> Interns are expected to
            maintain a high standard of work quality, proactiveness, and a
            strong commitment to learning.
          </li>
          <li>
            <strong>Evaluation System:</strong> Your progress will be tracked
            through a performance evaluation system, which may include positive
            and negative marks based on your contributions, adherence to
            deadlines, and overall engagement.
          </li>
          <li>
            <strong>Professional Attitude:</strong> A positive, collaborative,
            and respectful attitude is paramount and valued more than
            pre-existing skills. Regular and punctual attendance at all
            scheduled meetings is mandatory. Uninformed absence from more than
            two (2) meetings may result in a formal performance memo.
          </li>
          <li>
            <strong>Disciplinary Action:</strong> In cases of consistent
            underperformance or failure to meet expectations, a formal memo will
            be issued with specific areas for improvement. CyberDude Networks
            reserves the right to terminate the internship at any time if there
            is no significant improvement or in the event of a serious breach of
            conduct.
          </li>
          <li>
            <strong>Code of Conduct:</strong> A professional and respectful
            environment is mandatory. Any form of harassment, bullying, or
            unprofessional gossip is strictly prohibited and will result in
            immediate disciplinary action, including the potential for
            termination.
          </li>
        </ul>

        <h3 className="font-semibold mt-4">
          4. Public Engagement & Content Consent
        </h3>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Meeting Formats:</strong> The internship workflow includes
            both private project meetings and public learning sessions.
          </li>
          <li>
            <strong>Consent to be Recorded:</strong> Interns acknowledge and
            consent that public sessions will be recorded, edited, and published
            on public platforms, including but not limited to the CyberDude
            Networks YouTube channel, for educational purposes. By
            participating, you agree to the use of your name, image, and voice
            in such materials.
          </li>
        </ul>

        <h3 className="font-semibold mt-4">
          5. Roles, Responsibilities & Confidentiality
        </h3>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Dynamic Roles:</strong> During the internship, you will be
            assigned various sub-roles and responsibilities to provide a broad
            range of experience across the product development lifecycle.
          </li>
          <li>
            <strong>Confidentiality:</strong> Interns will have access to
            sensitive, proprietary, and confidential company information. You
            agree to not disclose, share, or use any of this information outside
            of your work for CyberDude Networks, both during and after the
            internship. A separate Non-Disclosure Agreement (NDA) may be
            required.
          </li>
          <li>
            <strong>Intellectual Property (IP):</strong> All work, code,
            designs, and any other materials created by you as part of your
            internship responsibilities are the sole intellectual property of
            CyberDude Networks Pvt. Ltd.
          </li>
        </ul>

        <h3 className="font-semibold mt-4">
          6. Exit Policy & Program Completion
        </h3>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Voluntary Departure:</strong> Interns are free to leave the
            program at any time, particularly if they have secured a full-time
            job offer from another company. We request a professional notice
            period of at least one (1) week to ensure a smooth transition of
            responsibilities.
          </li>
          <li>
            <strong>Certificate of Completion:</strong> A certificate of
            completion will be awarded to interns who successfully complete the
            full six-month term and meet the required performance standards.
          </li>
        </ul>

        {session?.user && job.type === "internship" ? (
          <>
            <p className="mt-4">
              By proceeding with this internship, you confirm that you have
              read, understood, and agreed to these terms and conditions.
            </p>

            <div className="flex justify-center flex-col items-center gap-3 mt-6 mb-3">
              <Link
                href={`/jobs/${params.slug}/apply`}
                className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
              >
                <CheckSquare className="w-6 h-6 inline-flex mr-2" />
                Accept & Continue
              </Link>
              <Link
                href={`/jobs/${params.slug}`}
                className=" text-gray-600 cursor-pointer"
              >
                Cancel
              </Link>
            </div>
          </>
        ) : (
          <Alert
            variant="info"
            title="You must be signed in to continue"
            className="mt-5"
          />
        )}
      </div>
    </main>
  );
}
