import SectionHeader from "@/components/section-header";
import StoryCreation from "./_components/story-creation";

export default function NewStory() {
  return (
    <section className="min-h-[calc(100vh-3rem)]">
      <SectionHeader>New Story</SectionHeader>
      <StoryCreation />
    </section>
  );
}
