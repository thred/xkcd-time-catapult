var imageNames = ["8eb156cce408df8bb83528382d6a2aa2ce6c74f3c573fd12b058cd1c56420672.png", "1e349a579b5f9b5ed487ddf7e88244b70330941ddedac9c6abf6ed2e3f589b97.png", "e25be2dd49fe9f33c3543cdf640b67e0f2146cc576db5da007a135a278e524ee.png", "5614c47bc2f28b730a360f796cc2993ba04e1f09db0aa3f325e476338777a9c4.png", "69715ed9abc8deac4fa1edfd49a7fde6970b1c8621a381b1fca2c0854b29c0dd.png", "752687b61523144c61736cd89f8c153dc41e19128f72d78d44947ff800f057fa.png", "6e162ade96f5a05b3223df0bcc6fd2ca3c76447a8d6095cee7ff56b2816c959c.png", "cdcc6b46b32c53f8596cd0106958b42c4260b9cbc022e6d94054147aa6554960.png", "49b69c39cdd429cdf367e215a878f536dc566862ae00b91814adfbd264753d89.png", "9a047f93c3da13dea6f46816cb32a7e45d4a8318205cdd9233102f42efe3ada9.png", "109fc96e2c07e50da5c4d0ec77b0722241aa32c494791e7627c52e8f9f773329.png", "fb0cabb8215b77a9d2fbdb44511eccdf9b921125bff5060dc511c9a49e97aa81.png", "426033682a26a0012a6f8e0c47287af91b7991a852d81c77402c937ffbd650c6.png", "007fae5ead14f798ec94f3a3ff6eea56c551d13068a2900e5d50d658ccb2be10.png", "90a46673c29fabb6a1eca1d3d0c5f52103c8e48b246e328dc2aed93b32e48ecb.png", "53732f97cd437d7148faeecaaacbe492ec03ae42f0747933ed3068248f74a25f.png", "a901246fd70dcd0054429bf55ced123ecead832300d73dedd78857d91eaff2df.png", "4b1dd11cb21b5631ee8c36f157076fd6185c62a90a580b41357901fcbb7f2190.png", "407f7e8766a75cc25389b7852cd9be4f3f29994eeb5c35f0f7d5656e186d4331.png", "832a7f13ca0fadc46e93475bb617d78211e32c81c3af0e289a51f8f149707759.png", "847265673986f085460bf1a95b96f7171bcd9a4f1f0a598b2188307d03bcfaa3.png", "d10e0b58110b9182b3dac096bb9f95b299bf7245df8af147428e9070bbbddb1d.png", "4e786f10bc85e1a188f557dad89b4938a3f6baae50200d15924ca238d1e6273c.png", "a3aa116efca3c01d8a64c0c7e79158dc8a62241aba767064e3a6c724cc5ade93.png", "fce427e9442e1b4bea98fa5ddae9d32d7c1cb0219de663196ee160a0e04cd4f8.png", "470d6f2b03fd4b08d4a3f40c1a969ce84ce7b87fefd441a561908f2f5700dc88.png", "c2e1cc28a59b7184d3c3306a655d048669963412c0cf19f164afdc283ffdaf94.png", "b2c52fd7587a8b429a27c0b94aaaec7dda657baa71f8651458440912d6de9049.png", "4ec08b20b0be913f7f0f9faf77b30f4bf2d683d224cc9b87479fd8706ad0aa75.png", "fc4a27fd780fbba0e88ffc6c4552093f082acbdfeeedbcd38319cb5793a07e32.png", "d8a70a1ca8aa3a3f9933169fead2d6f0784863f4563f83345bfafcb42a9dcafa.png", "7725087f3a098133ddd849f7e6ab7660a916acef3315e80244bd849ec491ccb5.png", "bfe8bc08b7cf436df87ed9c4c49a8bfb4be2f09b6e28aa1a54ceedc41cb1ff5a.png", "5295b1eeffffdac0385c84511f7d6258136bd390b7215027bc18f845b189095c.png", "f00822bdd210187c867b3408180ba93f715ca23a178758d12a0e4bddcbee0679.png", "40c463ee4cd0797979ec9ced3fe4705f4f71050d8ade084cc6ce82ba414784c1.png", "f46c6571393bee1ee649a7daae41f6328e63482506aef1e22607d22c47dd7027.png", "88e3a0c8bba935c669606d9134314f811a0961985f968dd5d329e4695acc67c8.png", "c18731de1f786d812d41800e7c86a6b05b537c1e86519776fbaed6a90db7d432.png", "1d51d7be045fe97dc2359c27dd9f9eba8e9f2dc18cc5bea5796ea1e7ebcccf66.png", "121d97f2b78cd18e2f6de40882f13b8759b865581d12edf665e66566edb2e333.png", "13bed763cccb9909272f00e1a1fe92e8360c58a6dfcd322054491bb2d53bd084.png", "6187b994ac8a43b71203733c7d28d384f47480b115524e41a30bfaf3ae77a405.png", "b842e5ecde53fb92406dd1de1d8a07571e67a265a458e57e79c77c2e932f989e.png", "6482bafdc122a24f837eb45ac530c7f7f3f54adfb3f309061520c394f895b184.png", "2545500fe415f155cde884403f48520d64cae3ae7bc2aaf0cdd66a1b3a5ac1e9.png", "1da3859627430022485c53ad90e88e8771b2bec2d60e910b59ef332325bba29f.png", "7db653f7045aa6781ec3c7db54279b56f39ec3ef24807cf02bf58a62492579df.png", "14fc092adc9f3aeeb7b066fb54ead77b56cfb58eed5f4b736ff94f0207959169.png", "50adf5715b4cb9a2a23f87ff0df5f618560fb1fa771afc6d5d38295c6effb40d.png", "a790d74849afdba2bc7f1781ea6fca9fb62b57d46912b14c40d777843d493f1f.png", "427f9bc8bd184356928562515d420ad9e96a1189043c812c4ba8e1bbb6080ffa.png", "6e13d39f86a04ff2770cafdccff6fd953ed0222a69cb322a68ec595b877db391.png", "305b4d99ba0014a0704b7454939205888f404ffb860d1acadc0d79b84cca88d5.png", "f44b9ada26d0fcb9223e51030d4cd8e0384bfa616e850f04f863077c86e06461.png", "201b34b87eafe69f97b131ddc6169bb688749596c19712df5f410ce9bee20f14.png", "69085b480cb82911b19fe8f114909756989eed89b0d227db0f59c1843de7ba24.png", "55f56bff8868cb2dd75035a69140df58bf1ed2b21bb7739fcb28dd12960d0bb8.png", "f5412e1dbb9bcc3f82bb373156266de1a3f841a6720f650a73980b563850f2d7.png", "9363661d4da84ab7cfe2901830663d255696196e54d4c1207874cb6b561adae9.png", "6893da69231d1d44413073c635f1162c12d95068a22a8ac16c39c941b3e47bce.png", "ff12649ab08e48655885fa89536cc034155a9bd4ac9af77775a31565ee232461.png", "297347fd8b2fd37f4df96388ce5f9ead1a89571887b721c087132ba1007cbb7d.png", "5fdcd88b53fc5e7bcb67ca78d3e426f0d4d55bd322a93570ce3485cf6fe95852.png", "a97951338dba988c7362713b946b90b9375fe947500a4a76ba1da7205491b55f.png", "261a4c70a112b18d15211cad535fcd3c6c3f16f58a50e99b6ff30dfbf79bd24d.png", "4cd7d0ed6cb0bd40f6c0f65ed0dfa3a81a6f73c3aff72a5c66351ec8c35027d9.png", "7633b3ae4aac3ddbaa17ed86994a28a20d0d27f3b15047fd932380844287dbbb.png", "125364a4d8c1544bf5234a3ea76bb9f09cb3ee397b60931f7b17f272a82712f2.png", "9334f1c89a263b82b14e9a91b97a5fba59f1147569eb47aeab435e88d0d0b199.png", "805819c16bb562698b72871b8e494d4ef2905fb32dca4b12910d744efe31f9f6.png", "600bbcb1f0dbeb19d343ded7c7c8c6e63cecefd29849e1da68684ed53c384bb3.png", "fdbd747655fc15d13f161e3e9f8d33d7a482d36395293b26f00a598069857d9c.png", "b73990c62d82380282dfdee6dd612d6a1afaa570e1be1d5300bc7da04ced684a.png", "b69578076ee90a852d5d672bd5863eb890f466f835fad1a340ea48b4c10221cc.png", "090f22722547c275aa66a413ef76f824c0e9aabfb7053407cb64ecfb68e44807.png", "0fcc1a8ab0c7b8626da1d9cc214ca8aa21860d439743027b7585a8cd433c2c95.png", "92acbd596029cedb5396ebaa8c6438ee68b30a3076a5968c00194873ea2ad76b.png", "e87184da8a81517fb389a74ce34de3b2f6e4b3c2b55d6de9cc505023d89566e9.png", "b356030ec86a14ae7224ee50d4af063d18cbd48e6a3395a1b6bd0c9e04f6ce70.png", "de86486235c332c24539586f6118e44e3a5ef0655637c42a8ce8aeeeddd7418a.png", "d4674f445c468c3c90c3f8866b05a682fc296190c95ccce771a42eee53543649.png", "d5d760b5528c5276d42e7864ed4189e9f03b68cb2addbb0992e6cfee7af1b6c1.png", "9b440f0dd9a67f61cc38262f1dd93dd8a77c60c23fb09670961748779d88680c.png", "560372e93e497f223f00fb9196494fbf2bc8e06fe01fd12548600d475ef058f6.png", "775f6a4e70b978e69787d57de0cc4df349fe439cc34cb560f11ecf87d2065c1e.png", "caa0f012b4706ebcaaad92356896d91610629e7a064ee179dc1810d72e981a2b.png", "ebb0517f6246f36900e34c511379cabdbdb46a632de0b794e614a66981bbfa2b.png", "fec3db94a8ad6abe44048ad458570346f5f350d7cbf2c6050eff8d62106a019a.png", "75e88091d88984485b51ec90272162112ed280a92a29970f60bc7fcfd6214570.png", "293f68d990c4aeb9a9d3b90b74749c1ef605d743cf8a226d254c589c22b839fc.png", "f7dbd7d72c8fb8f487433ebb33c7e365e17da48dc79a1c3457232e72f475f0a1.png", "bf8927f9779cdcdeb7fe7697b1110596663c12ab1e2e4fe5aff4e54ffa484217.png", "de3d109294d00f7ebb54514a8b3f9b0297c06419c9e297c45e5770f1406ab7ae.png", "e594b36574fe7bd54609058b25e3be58ca355bb85cd01d4b9016c1c7a100ab30.png", "3eac1b3e675661ba327350b49f05d45d40d232b20bf74eb44bbb1c0d6860c9d2.png", "a228595caf108b46e53f4fe276ebac8fa1545928b650742b0812298d5dfde441.png", "b8fcc150729d40bf3f3e07c30091a48691cda3ea9b8b0108d06d62bfc1e49b24.png", "fd441796100d891d67e0fc2cb6489534d7ec7f245415a753bb1097dc9f680e76.png", "1e81542c8e2449e1914b12771105ff4e4ec406bdebd8484febcf273f05dce171.png", "e74239a37b32a8b073a4cf0a837fc074ff70471116f5ce1ac9b5cdf529cd93bf.png", "9c8b0e5c90dd5b110ad625410c2e84cc4c676065dff14540e326f04e0685d958.png", "c07bccb54068e923c0207b512a5b320acfb09e78955cc5ebc02cb3905e6a993f.png", "31680693a02591e2915444e89daf81d953bf3e31ccbeabe42bec249c0eb65fac.png", "81efa7c4509ac7a329407d9da25d12ec0a3baec50e06588586961575e2d65c2c.png", "5450bd39ee84a394467fabcaf92f1a5711c2a4eca24c8bd8a8cec829496e3dd7.png", "c2ea85f1ab92f2f80e9c4655c47f5c7effc0a7da01c8a88493864845855b3be8.png", "a6adae53099480f255efedbc9016fa8d7a35b7585df857eb862c899ea61e8e48.png", "ec55b55b7975789bb4027014f70c83e4d9531af3b4002011c89ebe21da650757.png", "7bef63e1f585b0f3533aa3bd74f5a6acb5165a3cd2dd733bb55684ef637824bd.png", "36ae35d270bffc4d2f361136bcdd0f77339e70d6d2e671d552cbc019e2d65991.png", "dee195fbda954e00f088392b150c75cfbe33126d76f9fb910c0ffb51d5630d94.png", "be5c157cb9d932684f0f8076d0695a428eab022c734bbe448ea42ac2955e4402.png", "d40f6d35639642db88ea44f3983cc1bba646f71f7221357df6b2b8161c5e67cf.png", "936c86c4ecc817ada8b6e601df8a1e65850882ca80edf78dd98a37e7ffb18893.png", "3c3566958f0430bb674416ecbd57bf611da92cfefc2e50e44a49cc00f9299036.png", "244b0f188398cefff270856d4c0ee9af0c2db8134fa70943add99edb27b7cdd9.png", "e27f5926edcf05b2e2b41910c389b74344235785e012da24df115c7ad3e7f002.png", "124dad543960a6f296094cf15c9ec360facb64fbd1a6bc8505bac3e850ce6ad5.png", "08f2865464505d371e3af50cf8d0f0e69fdb199ff0fabf52da6c45a67e9c49d5.png", "3b977e96932637237697e2a7feef9d59f3b1bd03e49df1a0c8c7e73643df65db.png", "df86194e09adf979ff256993be5d6c0391161a4cdf7eaedb0f030c7e706a74f5.png", "6489605b6f6755c712c8aaaefe668066e36eccaffa0cc9a6f5b3859e43a4ec99.png", "c918850ed18afe2c3f3acbeef9c799aba5b10a8efeb45a2f026565383f0a72bc.png", "48283abb3b3bea7632a09ebf4494cb3023f5fbe1c564d4f27ba162ccc92dd2f3.png", "a2f77a4b339f71bc78bfeafb550318de6a31cfd5cccc4be8ef9cc1ab7cbc4c7b.png", "f8d6d86e39ba397db5f00ee5459508ca2b2cb06a531134ea295a8c7a8c540c2c.png", "96a5aee8f9cafb0382b95c05de69fa1e255eb3d734db4ffe643fa03445b275d2.png", "f86996436f7fdc5d2889cf2ed6695522ccd8bacaba17be9654ba9b5675e596bf.png", "16012cbe4d2465a1d5b33188821cfc60d4b27663d50709933d2633fa1c66fb26.png", "f376229646427451223a2595083b0e7eb8f2af63e17b6b9243e379fb10bbbdfa.png", "b9617babd84de8b63250587724ee364668cf5e4ba62561b91b1cd17d32c92a00.png", "2ad7854603527373dd550f3e065fed7964d3734f06aa366c89b24ae6b96039b2.png", "5be48ef973e98abad7379439d178c501235d8c39597615dcd89eb189ff6d7969.png", "df31189e5b219e9003a31b64d37b3670697e8cabf34a6a4a680b95e0792bcd7d.png", "7de21d7786688b2ada78fd8ce6a367f43b70f5cc1146a03c9b01921586e54d64.png", "d1926493facc13410b142000f4c46e1cf96d3863b2d120a9a5d155a8e84528fc.png", "457a12ac738a7f88c0f6f35837882514fdf06ed25c4f549627508aa50de1d34d.png", "72898115d43cea1451aad2d204597ae9ba53d3820efe22b7ede0532497641d2f.png", "a545e388ebf0177d92bc5104e9a7eec231c1b499cba3b55baa3c8316a8005068.png", "723d460e7c0a3bd93c8d158be8127865bc7fa9456d4df331cc93fda73e0f8889.png", "4c92727698b704ee1d02fbd37c94c220d16be4ad3ff6fc03a3fb77ea6d96434f.png", "6ff7e6fd1af6ec66eab68c8bad6a2d2205a38ba742e2887d568f569fa5289963.png", "05457c91f50c216f6071ae194b4d1822770e1792b0c73eb0fba3cbbdeb616ec2.png", "86f07ecad6c1873963da80b9bd0a1568dac1bec84bf5a675bdafdee076de20f8.png", "71a02d54537aa7c26b5136628e9a2cf1bd7584a152b76f72d648c6da5dcaa792.png", "353741527bcc681667b7d26fce0e5855e03e6acbceb5c627e5606d6a67cbc7c3.png", "4cfb1c2824a5e51e161f3ec1c5d2199b0058b60872ef3f26df928bbcd140a7b9.png", "aff5b3e6c82a9711fb69fa639392bd0eb4987bc016ef6e8f742badca1c3b67d3.png", "6b9a4c7c19d902ad81633e1d7b9df4041a2f744ce365e34648f756cf3401b019.png", "0dc7bdfef2b3b9594fbd4ec80b8fb3d835d4ff4002f6d5fe61227fdd7384f9b4.png", "88217a315d96eb39535f8b1564f3827d0b84fb0f031ced232136a773f27189de.png", "dcbe928012a06ae5118d4cd3850a4f1bcc0a7e4e86b2c04751fe79370cbb35bc.png", "1c9e30c1ea206fd46ef2bdfb192cf89e83b48b8d9718cdf5accec49afe6058cd.png", "1e0e30840f50bf42f9c3970703d9274afabb4fe8ac3998b623a1111a7aed9320.png", "d318e77ea28ef148af0f0b7ee275810e5d30f287be1faa493e7eb2163083a4ac.png", "7a9ad04ca9ab488bc7673dfafbd69d384300d2265339020ce2a86befe814b14c.png", "ff7305f8c90cbc9e37825f15b1f199076a270d1fc8365082c0bebd3fcafbceee.png", "8b2d052e799618ffd31c769e528b7dfd3046011cb3973cafcc4610e1dbc0f90c.png", "fdd2953ddeef587809f67b1ee0d7f26241c4007b842a5cff42f52fbf47847e77.png", "778828ccd64092f3fd5bd355c56ac200cbf1bbb7d194073b47dd31440f541987.png", "a11ef76a620cef2817167f7942294610d47bda6e1eef001a83a2408e41d8383c.png", "23114b4d82663a01a3644bc45280f4f85686557f6f96429f72fb56a30fd5af32.png", "40f1d3ba22b0180fd01403f8bc2f285fc9fbb6cec44ce354dfa5a3a79cf8dd6e.png", "111d01029afc7b55c1bb7c85aa96ca9cc5cade53b4a5ab4770723051771f010c.png", "38c86d07370946b20d4cfdffa3bccebc3c482eccedd6e0dbd749f986bd88ad06.png", "fec33645ab92d72764140c657f7d095228e914df7be54b6fdf794c498ed878bb.png", "932c13f387a0d346dde14e3ddd7d598db79e420fdc3ca93c109715377018b86a.png", "0a17cbccb6644aeba7896c8ed20857941e2a0fdd6e21d58cdf6ea1074de81a2d.png", "74684c8be1c329cff776759ab29a3e614834d107ca99626805ce318268e74471.png", "9996f99ec0e08c63b8f50c9900c73ba37417fdeef2a17888748cc0c078370b82.png", "61be4c0049c0e179be0430bc42a65e429ab5c2ebfd3266eb7715d471cef4c5ac.png", "dc04c4f093f993d3dcadd13b2f68953c2326c4f1e06d5bfe3bcdb5351fdacf85.png", "0c13b40fb2d866d6d00a267bbb71f844731d97ed9982f97f1ddc0eaa1a054cb5.png", "7d8d0f7cd3295fef29ee92973b1f4fe9f71caf396599376e01e5a2f203d517d6.png", "8f30c75832821619584d49c74a41ace49b28502bd8cad34920060065dabe4760.png", "3dc97e7c04106693b7857ee9c826b8f967248906ad2542cae843149f3d9de11d.png", "15364ef2ba8609090bdd77af61eb97c2c81e2f4297d344c196b2373b5704158f.png", "c1ede6b96909180ccccd3069bc6c705b9f5192b3efce2cefab1ead3d6f9e6210.png", "0734c09a321730ddd8b56e7e4a0c77b4c66f01854d71af2d082396b4e679bb97.png", "902212c46f09f94e94dbe6e01dfda56368c3cb44c6dc37492b6c3a7d691779ac.png", "74e77717fac78d11fd43085d5d276e4effb653d3f57867f398218fc28c259797.png", "7c052dff32f89bce9a1b8561f1ff88e3f32adf44be3324e0e1e15529d8bfbd5f.png", "d5c4fbc90763b88f1bc39a3483b1f4ff54c0d1401638291e323f2d05665e0254.png", "dd80419285db208bb20b5e5f38b4f18514324e450f9441ea75694551d00ba4c8.png", "96fc73424d680b37f414c9a9c1668a9cb46219c908822b198e1c2d2a46f9e304.png", "e8826d5232471207d9acdda7e861e1b11df7250c138077934d972dbec7e6c713.png", "0583ddbcae4d6554c7ff30db0b41215bd5a987729fc5df3c9478d6945080cf01.png", "d388c7488c115f2aa9b83716d710ad8deefc204788b5b78d12cb3b1e4c13feb0.png", "0a0871fcf81b2d5cf0b38423da70479160bbf76b58e7147bbd92af18b7f2fa02.png", "7a0fb337ec7cfded3864660876fceb71e4ee33271a3fee35a27e2490522f88e1.png", "380bf765ef848dfa3d0fbce63e33a3beb27ff65c23fd2e9ed9a13960b50e27a6.png", "94324cf6f6c3d6e26e5b322457399ce2b470d385448a93c5836c36a04b5e247d.png", "cf48609ad9cbf5c76fb4dc1b600ebb6000b4c4ac1ca3006c066b36ac6cacd71f.png", "914d38e3bb0d12761722225c519f8e3805f8d9e6983d45c999e1a5b6e9c6fe52.png", "b23b129add263c963346926f87ca9e98fde173cca229b523a4b107179b6c2bfd.png", "d6c3d3f532840c7f7a91bd1a8600d1fd91ec42d8a0c38fdb8e51981f92cb25b6.png", "48c3a3a67873d7b898a6b62262b2b8346da8aea034d2828da49423eaa95ef0c6.png", "b26fd8db9cf5cd02e28b9a9980982a420210c1ce79a5de52a4152d17314a6e75.png", "98309ac10ca3cd7a4103c0af50a1e97d43ac1af8bd3a23d0df60aa2151f14e7e.png", "a836b413645372f23817958930ce833c001a8f4fa068c714f0817da2c9f40851.png", "9f428192b6c9902ae3593bbffa58309151398b7ec831969a26691d250e3ac1fd.png", "fd79a31e913bae398b4f951bd6227c8ff87755877cc854dbb958c986e79f2dc6.png", "23361f7bf8451f9b2d7eafb7a52537abcdbc229e129eaded6b9b1cd24e20cb20.png", "f0a2b35dc2984aa057dca0d308f97f0f4940c6ad54da5f408e34a69ca31b1264.png", "5d047eb381df13212da45c5951b825bfbbd9ec353e74c3c1c12c08560ef00b78.png", "331b29d9377b3488c3b7ab84daf73c449001cb8fed9087a93f8c9c6ed8a07d6f.png", "5829bc10939b5f3186863c9876b825b6f17f65b2c9ccc5ad53f49ee3ff7d6ade.png", "b141c54c85cab825432a74aef6c880687ef74149bccf3a90ab17a9192a620fe3.png", "37eba4d7ce0239d5d8b8aac659f464569debe088399ec70f6ac54036a82640a5.png", "b5d68c92f3be6db7d88ebe95e8ded8e430cf74226170d1c83f0665366723318c.png", "2791df0b398e73e2ef6f076347efa4e096d1dfebb9ed85e8907328b869b47ae2.png", "5c438637048d073f8df904f470857e98f60fdb3bc0a52288981673298ece1aa1.png", "05db632ef7b5854c6b5f78fc86241dab86e367d30a548cb8e11b82927755fd68.png", "123a0b4c0bed576929a92c14121f94c1f05df51e02db4760f3cb337c55285f33.png", "e59dc42db84d46c337e9905ffed21be7375467f13d91271e6562e23aac234460.png", "ed879c1b8163ba7b3fab78d50f7babc2c2d43797e8c8abd0f32c1d9aa5711235.png", "4cf2cb81ec6fefd45435e02bdbe8a8ff4efde70afa810ee1b9c86e112f3ebb50.png", "63a64bacaa5e6b292d2263446d08a04ca3a0f8588051581f95e168d30e8aff43.png", "d150930e1e77708757cce440d3b4a9aa2bcb7991ad58d74ccc6a9f6b8c498928.png", "c64849828274fff4696ca09c2948af41458d65675b42407520537ff1ebbedf62.png", "08d3815ac95c2d88160c5df82e634a6b3f4b568a7e84b7c979a5f6c8816c620d.png", "c3996c2b354208f58f03d3f723c166aee834e8eae2604fbb52e718afe326186f.png", "cf78d3227b705b1dbb66608be417ca68065b3cc10140d05104045422b44d0699.png", "20c76ad813b54775c5c2b49747c077dedb1702b1381a3eacd29f25184237bfc1.png", "190e10a1f345945678fe3131ce3213dc08cac58258325b4c1bd294c937b1ccb3.png", "948876e26ebc53c0dc86521250abde10db4423f2409e2b7ae232e967696530f7.png", "ac0e579380fcc22504418deea5cd2e52c2b474cc667691188a4a1b1c9eb209f2.png", "0aa1f65aafd8bc1392e917d188dbd5905d00bf3ec76502d30dbe90c55712471f.png", "8beeb30463e7b617e56403c7d7cf8b907e9e9425b230c3d548111efc661e3704.png", "c134195b6463d4fb917c1f8f8baf0b1f48648ec6456ad5793115d7525d6e347e.png", "d4aee9e183645e1f04a6fc2e28c2320b2d8c14c7594df0b24527ad1db60e25a2.png", "d93de79988687abbad1f824ea997592f15adc771efe9cb9650396787dede7181.png", "2294962087712b159a1fce469bef14059bf929fb47dceab0333c5a2008fbfaf1.png", "36d19a55ae80eecd1988c3ac2907c8cba353849273f5d7ec008cae32a0d882a0.png", "3161cfc64d70842bd02e28cc01e0c4513a63cc0f6706ada41076ffe9ad4303e8.png", "a34b654398eccccafdfe1272ef1b8920f73268ea4a610230d620127461939d2a.png", "5adc81ebbf379b988de27a88b3db593956a143acd32849b35c54031b75ba7c63.png", "8a734902b6524108baca8054ea964c052d5c468807ddbb3a1b9d6a49dd5ad99d.png", "b58d5b9e73aeb09d1cb7749a11d460d55b0e1a97b608a2b6d4ef35ab166a35a4.png", "a34d91201f0d6f798ac2206f97e4f0776ff223fceb00a7c51d6f9b8daa14f366.png", "0464b40b22150831d584f8dd3c84b735182d4951ee79100d5c7759d0dd5d60fa.png", "9c0b8df47c7a04141cd887240f8cc201ea23d2ff48f94a63be335cdc2a271a5d.png", "6d8e898386c71bbf9319202bfff67a2b73f121d13df4b1211260711002df4bbd.png", "76407b7bc376b7f1d611653f105e888f027bc1e8308cacb262ed097ad278d776.png", "7a2a2e622c8ef2c155c7301b4e78c41119cdd3b70d118cf0a0248cf13bcc3c85.png", "3605664e5839078774d6ab111a22d230e03e9363f833dba75de056a0304a6f2e.png", "793ff1d7b827da12512c7fd078cfd107832e77fa5c66b7536a05297d6a51111b.png", "9407d63cdc4af881a34e827242dbdba3328680841dfcdda750a4fe0829f864a3.png", "89b946c4d79b7b9edf1d643bd753068112c4c1d7212c88d1b55684a245d00f8c.png", "472a664d6080e40cda872258f89ec8db899d6edf3fe457873b1729d011c32117.png", "506e4482b9dfda6906be12a0f08db916374545d56b4dcc23e220c63d777febd5.png", "c6976fbb244af4fc2286ffe3ac2cf78d408c1f610ecd71e18b4a677a048f084d.png"];
var canvas;
var overlay;
var canvasContext;
var overlayContext;
var canvasData;
var catapult;
var lastTime = new Date().getTime() / 1000;
var images = {};
var pendingParticles = [];
var particles = [];
var G = 10000;
var WIDTH = 800;
var HEIGHT = 359;
var isMouseDown = false;
var dragPos;
var ready = true;

var Vector = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};

Vector.prototype = {

	constructor: Vector,

	set: function(x, y) {
		this.x = x;
		this.y = y;

		return this;
	},

	add: function(x, y) {
		this.x += x;
		this.y += y;
	},

	sub: function(x, y) {
		this.x -= x;
		this.y -= y;
	},

	multiplyScalar: function(s) {
		this.x *= s;
		this.y *= s;

		return this;
	},

	divideScalar: function(s) {
		if (s !== 0) {
			this.x /= s;
			this.y /= s;
		} else {
			this.set(0, 0);
		}

		return this;
	},

	direction: function() {
		var v = this.clone().normalize();

		return Math.tan(v.x / v.y);
	},

	setDirection: function(direction, length) {
		this.x = Math.cos(direction) * length;
		this.y = -Math.sin(direction) * length;
	},

	length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	setLength: function(l) {
		var oldLength = this.length();

		if (oldLength !== 0 && l !== oldLength) {
			this.multiplyScalar(l / oldLength);
		}

		return this;

	},

	normalize: function() {
		return this.divideScalar(this.length());
	},

	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},

	clone: function() {
		return new Vector(this.x, this.y);
	}

};

var Catapult = function() {
		this.particles = [];
		this.position = new Vector(128, 258);
		this.theta = -Math.PI / 3;
	};

Catapult.prototype = {

	constructor: Catapult,

	draw: function(context) {
		context.save();
		context.translate(this.position.x, this.position.y);
		context.drawImage(images.catapult, - 24, - 24);
		context.rotate(this.theta);
		context.drawImage(images.arm, - 14, - 3);
		context.restore();
	}

};

var Particle = function(position, velocity, scale) {
		this.position = position;
		this.lastPosition = position.clone();
		this.velocity = velocity;
		this.scale = scale;
		this.rotation = Math.random() * Math.PI * 2;
		this.rotationSpeed = Math.random() * 20;
		this.alive = true;
	};

Particle.prototype = {

	constructor: Particle,

	move: function(duration) {
		this.rotation += this.rotationSpeed * duration;
		this.rotationSpeed *= (1 - duration);

		this.velocity.sub(0, 1 / 2 * G * duration * duration);

		this.lastPosition.set(this.position.x, this.position.y);
		this.position.add(this.velocity.x * duration, - this.velocity.y * duration);

		var vx = this.velocity.x * duration;
		var vy = this.velocity.y * duration;
		var length = Math.floor(Math.sqrt(vx * vx + vy * vy)) + 1;
		var update = false;

		for (var i = 0; i < length; i += 1) {
			var x = Math.round(this.lastPosition.x + vx * i / length);
			var y = Math.round(this.lastPosition.y + vy * i / length);

			if (isSand(x, y)) {
				this.position.set(x, y);
				this.impact(x, y);
				update = true;

				break;
			}
		}

		if ((this.scale < 0.1) || (this.position.x < 0) || (this.position.x > WIDTH) || (this.position.y > HEIGHT)) {
			this.alive = false;
		}

		return update;
	},

	impact: function(x, y) {
		var mirror = new Vector(0, 0);

		if ((!isSand(x - 1, y)) || (!isSand(x + 1, y))) {
			mirror.add(1, 0);
		}

		if ((!isSand(x, y - 1)) || (!isSand(x, y + 1))) {
			mirror.add(0, 1);
		}

		if ((mirror.x === 0) && (mirror.y === 0)) {
			mirror.set(1, 0);
		}

		mirror.set(mirror.y, mirror.x).normalize();

		// v ' = 2 * (v . n) * n - v

		var vx = this.velocity.x;
		var vy = this.velocity.y;

		this.velocity.dot(mirror);
		this.velocity.multiplyScalar(2);
		this.velocity.x *= mirror.x;
		this.velocity.y *= mirror.y;
		this.velocity.x -= vx;
		this.velocity.y -= vy;
		this.velocity.multiplyScalar(0.3);

		canvasContext.save();
		canvasContext.strokeStyle = "white";
		canvasContext.lineWidth = 6 * this.scale;
		canvasContext.lineCap = "round";
		canvasContext.beginPath();
		canvasContext.moveTo(this.lastPosition.x, this.lastPosition.y);
		canvasContext.lineTo(this.position.x, this.position.y);
		canvasContext.stroke();
		canvasContext.restore();

		this.scale *= 0.5;

		if (this.scale > 0.1) {
			for (var i = 0; i < 5; i += 1) {
				// for a cool effect make this > 1;
				explode(this, this.scale * 0.2);
			}
		}
	},

	draw: function(context) {
		context.save();
		context.translate(this.position.x, this.position.y);
		context.scale(this.scale, this.scale);
		context.rotate(this.rotation);
		context.drawImage(images.particle, - 3, - 3);
		context.restore();
	}
};

function init() {
	canvas = document.createElement("canvas");
	canvas.id = "canvas";
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.position = "absolute";
	canvas.style.zIndex = 256;

	overlay = document.createElement("canvas");
	overlay.id = "overlay";
	overlay.width = WIDTH;
	overlay.height = HEIGHT;
	overlay.style.position = "absolute";
	overlay.style.zIndex = 257;

	var content = document.getElementById("content");

	content.appendChild(canvas);
	document.addEventListener("mousedown", mouseDown, false);
	document.addEventListener("mousemove", mouseMove, false);
	document.addEventListener("mouseup", mouseUp, false);
	content.appendChild(overlay);

	var div = document.createElement("div");
	div.id = "placeholder";
	div.style.width = WIDTH + "px";
	div.style.height = HEIGHT + "px";
	content.appendChild(div);

	initImage("catapult");
	initImage("arm");
	initImage("particle");

	canvasContext = canvas.getContext("2d");
	overlayContext = overlay.getContext("2d");

	catapult = new Catapult();

	var image = new Image();
	image.onload = function(event) {
		canvasContext.fillStyle = "white";
		canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

		var x = WIDTH - 550;
		canvasContext.drawImage(image, x, 0);
		canvasContext.strokeStyle = "white";
		canvasContext.lineWidth = 3;
		canvasContext.strokeRect(x + 1, 1, 551, 393);

		var y = 270;
		canvasContext.fillStyle = "black";
		canvasContext.fillRect(0, y, x + 3, 395 - y);

		canvasData = canvasContext.getImageData(0, 0, WIDTH, HEIGHT);
	};
	
	//image.src = "http://imgs.xkcd.com/comics/time/" + imageNames[parseInt(Math.random() * imageNames.length, 10)];
	image.src = "http://www.explainxkcd.com/wiki/images/8/82/time8.png";
	// image.src = "time211.png";

	run();
}

function initImage(name) {
	var image = new Image();
	image.src = name + ".png";
	images[name] = image;
}

function run() {
	requestAnimationFrame(run);

	var time = new Date().getTime() / 1000;
	var duration = time - lastTime;

	lastTime = time;

	activatePendingParticles();

	overlayContext.clearRect(0, 0, WIDTH, HEIGHT);
	catapult.draw(overlayContext);
	message(particles.length);
	updateParticles(duration);
	removeDeadParticles();

	var drag = dragPos;

	if (drag) {
		overlayContext.save();
		overlayContext.strokeStyle = "#884422";
		overlayContext.lineWidth = 3;
		overlayContext.translate(catapult.position.x, catapult.position.y);
		overlayContext.beginPath();
		overlayContext.moveTo(0, 0);
		overlayContext.lineTo(drag.x, drag.y);
		overlayContext.stroke();
		overlayContext.restore();
	}
}

function isSand(x, y) {
	if ((x < 0) || (y < 0) || (x >= WIDTH) || (y >= HEIGHT)) {
		return false;
	}

	return canvasData.data[(x + y * WIDTH) * 4] < 128;
}

function addParticle(particle) {
	pendingParticles.push(particle);
}

function activatePendingParticles() {
	for (var i = 0; i < pendingParticles.length; i += 1) {
		if (particles.length > 50) {
			break;
		}

		particles.push(pendingParticles[i]);
	}

	pendingParticles = [];
}

function updateParticles(duration) {
	for (var i = 0; i < particles.length; i += 1) {
		var update = particles[i].move(duration);

		if (update) {
			canvasData = canvasContext.getImageData(0, 0, WIDTH, HEIGHT);
		}

		particles[i].draw(overlayContext);
	}
}

function removeDeadParticles() {
	var i = 0;
	while (i < particles.length) {
		if (!particles[i].alive) {
			particles.splice(i, 1);
		} else {
			i += 1;
		}
	}
}

function fire() {
	for (var i = 0; i < 10; i += 1) {
		var direction = Math.random() * Math.PI * 2;
		var distance = Math.random() * 2;
		var position = catapult.position.clone();
		position.add(Math.cos(direction) * distance, - Math.sin(direction) * distance);
		var particle = new Particle(position, new Vector(-dragPos.x * 2, dragPos.y * 2), 0.5);

		addParticle(particle);
	}
}

function explode(particle, scale) {
	var length = particle.velocity.length();
	var velocity = new Vector(length * (Math.random() - 0.5), length * (Math.random() - 0.5));

	addParticle(new Particle(particle.position.clone(), velocity, scale));
}

function mouseDown(event) {
	isMouseDown = true;
}

function mouseMove(event) {

	if (isMouseDown) {
		event.preventDefault();
		dragPos = {
			x: event.clientX - canvas.offsetLeft - catapult.position.x,
			y: event.clientY - canvas.offsetTop - catapult.position.y
		};
	}
}

function mouseUp(event) {
	fire();
	isMouseDown = false;
	dragPos = null;
}

function message(msg) {
	document.getElementById("message").innerHTML = msg;
}

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {

	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];

	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {

		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];

	}

	if (window.requestAnimationFrame === undefined) {

		window.requestAnimationFrame = function(callback) {

			var currTime = Date.now(),
				timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;

		};

	}

	window.cancelAnimationFrame = window.cancelAnimationFrame || function(id) {
		window.clearTimeout(id);
	};

}());