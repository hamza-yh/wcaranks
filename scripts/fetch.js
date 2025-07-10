async function main() {
    await fs.mkdir('api', { recursive: true });
    await fs.writeFile('api/test.json', '["test","test"]', { flag: 'wx' }).catch(() => {});

}

main().catch(err => {
  console.error('❌ Test setup failed:', err);
  process.exit(1);
});