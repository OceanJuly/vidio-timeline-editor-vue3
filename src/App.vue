<template>
	<div class="w-full h-full flex flex-col">
		<ElConfigProvider size="small" :z-index="3000">
			<RouterView />
		</ElConfigProvider>
	</div>
</template>
