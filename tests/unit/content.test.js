import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const readContent = filename => JSON.parse(fs.readFileSync(new URL(`../../src/content/${filename}.json`, import.meta.url), 'utf8'));
const content = { profile: readContent('profile'), projects: readContent('projects') };
test('published projects have unique destinations and no retired demos', () => {
  const ids = new Set();
  for (const project of content.projects) {
    assert.ok(!ids.has(project.id)); ids.add(project.id);
    assert.ok(['ml', 'frontend'].includes(project.category));
    assert.ok(project.title && project.description && project.detailsFile);
    assert.equal(new URL(project.repo).protocol, 'https:');
    if (project.link) assert.equal(new URL(project.link).protocol, 'https:');
    assert.ok(!/rag|sentiment/i.test(project.title));
    const details = fs.readFileSync(new URL(`../../src/content/projects/${project.detailsFile}`, import.meta.url), 'utf8');
    assert.ok(details.trim(), `Missing description for ${project.title}`);
  }
  assert.ok(content.projects.some(project => project.title === 'AdiBank Copilot'));
});
test('contact and resume destinations remain usable', () => {
  assert.match(content.profile.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.equal(new URL(content.profile.linkedin).protocol, 'https:');
  assert.ok(fs.existsSync(new URL('../../public' + content.profile.resume, import.meta.url)));
});
