import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import ArticleDetail from "../components/ArticleDetail.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/ComponentPreviews">
                <ComponentPreviews/>
            </ComponentPreview>
            <ComponentPreview path="/ArticleDetail">
                <ArticleDetail/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;