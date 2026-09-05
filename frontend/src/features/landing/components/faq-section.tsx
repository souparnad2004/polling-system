import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";

const faqs = [
  {
    value: "anonymous",
    question: "Can people vote without creating an account?",
    answer:
      "Yes — if the poll creator has enabled anonymous voting. Guests vote instantly with a per-poll browser token, with no email or password required. Creators can switch to authenticated-only voting for polls that need it.",
  },
  {
    value: "change-vote",
    question: "Can I change a vote after submitting it?",
    answer:
      "It depends on the poll. Creators can allow vote changes and vote removal. When enabled, you can update your choice at any time while the poll is published; otherwise your vote is final.",
  },
  {
    value: "real-time",
    question: "Are poll results updated in real time?",
    answer:
      "Yes. Results stream over a WebSocket connection — when a new vote arrives, every open view of the poll updates immediately without a page refresh.",
  },
  {
    value: "private",
    question: "Can I keep a poll private?",
    answer:
      "Polls start as drafts, which are never shown publicly — even direct links return nothing to non-owners. Publish only when you're ready to share the poll with others.",
  },
  {
    value: "close",
    question: "Can I close a poll?",
    answer:
      "Yes. Close a poll at any time to stop accepting votes. Results stay visible, and the poll is marked as closed with a clear status badge.",
  },
  {
    value: "comments",
    question: "Can users comment on polls?",
    answer:
      "Yes. Poll pages include a discussion area where participants can comment and reply, so the conversation continues beyond the vote itself.",
  },
  {
    value: "analytics",
    question: "Can I see analytics for my polls?",
    answer:
      "Yes. Each poll has an analytics view with total responses, unique voters, anonymous share, response trends over time, and a recent activity feed.",
  },
  {
    value: "mobile",
    question: "Does the application work on mobile?",
    answer:
      "Yes. Both the voting interface and the creator dashboard are fully responsive, so participants can vote and creators can manage polls from any device.",
  },
];

export function FAQSection() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 border-y bg-muted/35 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <SectionHeading
            align="center"
            eyebrow="FAQ"
            title="Frequently asked questions."
            description="Straight answers about voting, privacy, and how Pollly works."
          />
        </FadeIn>

        <FadeIn delay={0.08}>
          <Accordion className="mt-10" defaultValue={["anonymous"]}>
            {faqs.map((faq) => (
              <AccordionItem key={faq.value} value={faq.value}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="leading-6 text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}