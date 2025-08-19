import { ChoreMinimal } from "@/types/types";
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

export default function ReminderEmail({ chores }: { chores: ChoreMinimal[] }) {
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
            <Text className="py-2 font-semibold text-2xl text-center">
              You have {chores.length} chores due today!
            </Text>
            <Section>
              {chores.map((chore) => (
                <Container key={chore.id} className="mb-4">
                  <Button
                    href={`https://chore.jfang.dev/?mode=view&id=${chore.id}`}
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
            <Container>
              <Row>
                <Column className="flex justify-center">
                  <Button
                    href="https://chore.jfang.dev"
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
