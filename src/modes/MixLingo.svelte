
<script>
  let question = {
    sentence: "I always ____ my homework after dinner.",
    options: ["faire", "hacer", "machen"],
    correct: "hacer"
  };

  let selected = null;
  let result = "";

  function checkAnswer(option) {
    selected = option;
    result = option === question.correct ? "✅ Correct!" : "❌ Try again!";
  }
</script>

<h2>MixLingo</h2>
<p>{question.sentence}</p>
<div>
  {#each question.options as opt}
    <button on:click={() => checkAnswer(opt)} disabled={selected}>{opt}</button>
  {/each}
</div>
<p>{result}</p>

    
