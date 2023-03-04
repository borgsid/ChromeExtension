const getKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
          if (result['openai-key']) {
            const decodedKey = atob(result['openai-key']);
            resolve(decodedKey);
          }
        });
      });
}

const generate = async (prompt) => {
     // Get your API key from storage
  const key = await getKey();
  const url = 'https://api.openai.com/v1/completions';
	
  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 1250,
      temperature: 0.7,
    }),
  });
	
  // Select the top choice and send back
  const completion = await completionResponse.json();
  return completion.choices.pop();
}


const generateCompletionAction = async (info) => {

    try {
        const { selectionText } = info;
        const basePromptPrefix = `You are jill, a help desk agent for the fuorisalone, you only give answers related to fuorisalone, transportation, restaurants and hospitality in Milano and Lombardia Region. Always sign off your reply with a friendly emoji.
        me: {userPromt}`.replace('{userPromt}',selectionText);
        const jillSection = `
        jill:`;
        
        const finalPromt=`${basePromptPrefix}${jillSection}`;
        console.log(finalPromt);
       
        const baseCompletion = await generate(
            `${finalPromt}`
          );

    } catch (error) {
        console.log(error);
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'context-run',
        title: 'Ask Fuorisalone Assistant',
        contexts: ['selection'],
    });
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);