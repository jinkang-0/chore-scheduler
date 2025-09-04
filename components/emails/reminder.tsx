import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  pixelBasedPreset,
  Row,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
import { optionallyPluralize } from "@/lib/utils";
import type { ChoreMinimal } from "@/types/types";

const siteUrl = "https://chores.jfang.dev";

export default function ReminderEmail({ chores }: { chores: ChoreMinimal[] }) {
  const today = new Date();

  const overdueChores: ChoreMinimal[] = [];
  const todayChores: ChoreMinimal[] = [];

  chores.forEach((chore) => {
    const dueDate = new Date(chore.due_date);

    if (dueDate.toDateString() === today.toDateString())
      todayChores.push(chore);
    else overdueChores.push(chore);
  });

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset]
        }}
      >
        <Body className="w-full flex flex-col items-center justify-center">
          <Container>
            {overdueChores.length > 0 && (
              <>
                <Text className="py-2 font-semibold text-2xl text-center">
                  You have {overdueChores.length} overdue{" "}
                  {optionallyPluralize(overdueChores.length, "chore")}!
                </Text>
                <Section>
                  {overdueChores.map((chore) => (
                    <Container key={chore.id} className="mb-4">
                      <Button
                        href={`${siteUrl}/?mode=view&id=${chore.id}`}
                        className="w-full rounded-lg bg-neutral-200 px-4"
                      >
                        <Row>
                          <Column className="pr-2">
                            <Text className="text-xl text-black">
                              {chore.emoji}
                            </Text>
                          </Column>
                          <Column>
                            <Text className="text-xl text-black">
                              {chore.title}
                            </Text>
                          </Column>
                        </Row>
                      </Button>
                    </Container>
                  ))}
                </Section>
              </>
            )}
            {todayChores.length > 0 && (
              <>
                <Text className="py-2 font-semibold text-2xl text-center">
                  You have {todayChores.length}{" "}
                  {optionallyPluralize(todayChores.length, "chore")} due today!
                </Text>
                <Section>
                  {todayChores.map((chore) => (
                    <Container key={chore.id} className="mb-4">
                      <Button
                        href={`${siteUrl}/?mode=view&id=${chore.id}`}
                        className="w-full rounded-lg bg-neutral-200 px-4"
                      >
                        <Row>
                          <Column className="pr-2">
                            <Text className="text-xl text-black">
                              {chore.emoji}
                            </Text>
                          </Column>
                          <Column>
                            <Text className="text-xl text-black">
                              {chore.title}
                            </Text>
                          </Column>
                        </Row>
                      </Button>
                    </Container>
                  ))}
                </Section>
              </>
            )}
            {overdueChores.length === 0 && todayChores.length === 0 && (
              <>
                <Text className="py-2 font-semibold text-2xl text-center">
                  You have no chores due today or overdue!
                </Text>
                <Text className="text-center text-lg">
                  Honestly, this might&apos;ve been sent by mistake. Let me know
                  if you got this email.
                </Text>
              </>
            )}
            <Container>
              <Row>
                <Column className="flex justify-center">
                  <Button
                    href={siteUrl}
                    className="mt-8 text-lg px-4 py-2 bg-neutral-800 rounded-lg text-white inline-block mx-auto"
                  >
                    Go to Dashboard
                  </Button>
                </Column>
              </Row>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
