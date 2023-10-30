const imagePath = './image/';

type githubLogSizeType = '5x6' | '10x12';
export const githubLogPath = (size: githubLogSizeType) => {
	return `${imagePath}github_logo(${size}).png`;
};

export const testImagePath = `${imagePath}test.png`;
export const githubLogo = `${imagePath}github_logo.png`;